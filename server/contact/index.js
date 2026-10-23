// Endpoint d'envoi du formulaire de contact.
//
// Remplace EmailJS : les identifiants vivent ici, côté serveur, au lieu d'être
// substitués dans le bundle où n'importe qui pouvait les relire. Le honeypot et
// la limitation de débit sont donc appliqués à un endroit que le client ne peut
// pas contourner en sautant le navigateur.
//
// nginx proxifie /api/contact vers ce processus sur 127.0.0.1 ; il n'écoute
// jamais sur une interface publique.

import http from 'node:http';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import { clientIp, isSameOrigin, rateLimitKey, validate } from './lib.js';

// Chargé ici plutôt que via `node --env-file` : PM2 ne lit pas les .env, et le
// chemin est résolu depuis ce fichier, donc indépendant du dossier de lancement.
// Les variables déjà présentes dans l'environnement gardent la priorité.
if (typeof process.loadEnvFile !== 'function') {
    console.error(`[contact] Node ${process.version} trop ancien — 20.12 minimum`);
    process.exit(1);
}
try {
    process.loadEnvFile(fileURLToPath(new URL('.env', import.meta.url)));
} catch (err) {
    if (err.code !== 'ENOENT') throw err;
}

const PORT = Number(process.env.PORT || 8081);
// Pas de valeur par défaut pour l'hôte : le fournisseur dépend du compte
// d'envoi retenu (voir README). Mieux vaut refuser de démarrer que pointer
// silencieusement vers un serveur sur lequel on ne peut pas s'authentifier.
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_TO = process.env.CONTACT_TO || SMTP_USER;

for (const [name, value] of Object.entries({ SMTP_HOST, SMTP_USER, SMTP_PASS })) {
    if (!value) {
        console.error(`[contact] ${name} manquant — voir .env.example`);
        process.exit(1);
    }
}

const MAX_BODY_BYTES = 16 * 1024;
const COOLDOWN_MS = 5 * 60 * 1000;

// Délais courts : avec ceux de nodemailer par défaut (2 min pour la connexion),
// le visiteur aurait abandonné depuis longtemps quand le message finirait par
// partir. Hors 465, STARTTLS est exigé : sinon nodemailer s'authentifierait en
// clair si le serveur ne le proposait pas.
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    requireTLS: SMTP_PORT !== 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
});

// ---------------------------------------------------------------------------
// Limitation par IP
// ---------------------------------------------------------------------------

// Une Map en mémoire suffit : un seul processus, et un redémarrage qui remet le
// compteur à zéro n'est pas un problème pour un formulaire de contact.
const lastSeen = new Map();

const pruneLastSeen = () => {
    const cutoff = Date.now() - COOLDOWN_MS;
    for (const [key, at] of lastSeen) {
        if (at < cutoff) lastSeen.delete(key);
    }
};
setInterval(pruneLastSeen, COOLDOWN_MS).unref();

// ---------------------------------------------------------------------------
// Serveur
// ---------------------------------------------------------------------------

const send = (res, status, payload) => {
    const body = JSON.stringify(payload);
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
        'Cache-Control': 'no-store',
    });
    res.end(body);
};

const readBody = (req) =>
    new Promise((resolve, reject) => {
        let size = 0;
        const chunks = [];

        req.on('data', (chunk) => {
            size += chunk.length;
            if (size > MAX_BODY_BYTES) {
                reject(new Error('body too large'));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        req.on('error', reject);
    });

// Renvoie true quand le créneau de l'IP doit être conservé : message envoyé,
// ou bot piégé par le honeypot.
const handleContact = async (req, res) => {
    let body;
    try {
        body = JSON.parse(await readBody(req));
    } catch {
        send(res, 400, { error: 'Requête invalide.' });
        return false;
    }

    // Un textarea soumis encode chaque retour à la ligne en CRLF alors que son
    // maxLength les compte pour un caractère : sans ça, un message à la limite
    // côté navigateur la dépasserait ici.
    if (typeof body?.message === 'string') {
        body.message = body.message.replace(/\r\n?/g, '\n');
    }

    const problem = validate(body);
    if (problem) {
        // Le honeypot renvoie un succès : inutile d'apprendre au bot qu'il est repéré.
        if (body?.website) {
            send(res, 200, { ok: true });
            return true;
        }
        send(res, 400, { error: problem });
        return false;
    }

    try {
        await transporter.sendMail({
            from: `"Formulaire portfolio" <${SMTP_USER}>`,
            to: CONTACT_TO,
            // Objet plutôt que chaîne : nodemailer encode le nom, alors qu'une
            // virgule dans une chaîne brute y ajouterait un destinataire.
            replyTo: { name: body.name, address: body.email },
            subject: `Message de ${body.name}`,
            text: `De : ${body.name} <${body.email}>\n\n${body.message}`,
        });
    } catch (err) {
        console.error('[contact] envoi impossible:', err.message);
        send(res, 502, { error: 'Une erreur est survenue, veuillez réessayer plus tard.' });
        return false;
    }

    send(res, 200, { ok: true });
    return true;
};

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
        return send(res, 200, { ok: true });
    }

    if (req.method !== 'POST') {
        res.writeHead(405, { Allow: 'POST' });
        return res.end();
    }

    if (!isSameOrigin(req)) {
        return send(res, 415, { error: 'Requête invalide.' });
    }

    // Raccourci : une IP partagée (NAT d'entreprise, CGNAT) bloque ses autres
    // visiteurs 5 min après un envoi ; acceptable vu le trafic d'un portfolio.
    const key = rateLimitKey(clientIp(req));

    const remaining = COOLDOWN_MS - (Date.now() - (lastSeen.get(key) ?? 0));
    if (remaining > 0) {
        const minutes = Math.ceil(remaining / 60000);
        return send(res, 429, {
            error: `Merci de patienter encore ${minutes} minute(s) avant de renvoyer un message.`,
        });
    }

    // Créneau réservé avant le premier `await` : sinon des requêtes simultanées
    // de la même IP passeraient toutes la vérification ci-dessus pendant que le
    // premier envoi est en cours. Il est rendu si rien n'est parti, pour qu'une
    // erreur de saisie ou une panne SMTP ne coûte pas 5 minutes au visiteur.
    lastSeen.set(key, Date.now());
    let keep = false;
    try {
        keep = await handleContact(req, res);
    } finally {
        if (!keep) lastSeen.delete(key);
    }
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`[contact] à l'écoute sur 127.0.0.1:${PORT}`);
});
