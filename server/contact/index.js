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
import nodemailer from 'nodemailer';

const PORT = Number(process.env.PORT || 8081);
// Pas de valeur par défaut pour l'hôte : le fournisseur dépend du compte
// d'envoi retenu (voir README). Mieux vaut refuser de démarrer que pointer
// silencieusement vers un serveur sur lequel on ne peut pas s'authentifier.
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_TO = process.env.CONTACT_TO || SMTP_USER;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET || '';

for (const [name, value] of Object.entries({ SMTP_HOST, SMTP_USER, SMTP_PASS })) {
    if (!value) {
        console.error(`[contact] ${name} manquant — voir .env.example`);
        process.exit(1);
    }
}

const MAX_BODY_BYTES = 16 * 1024;
const COOLDOWN_MS = 5 * 60 * 1000;
const LIMITS = { name: 100, email: 150, message: 2000 };

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// ---------------------------------------------------------------------------
// Limitation par IP
// ---------------------------------------------------------------------------

// Une Map en mémoire suffit : un seul processus, et un redémarrage qui remet le
// compteur à zéro n'est pas un problème pour un formulaire de contact.
const lastSeen = new Map();

const pruneLastSeen = () => {
    const cutoff = Date.now() - COOLDOWN_MS;
    for (const [ip, at] of lastSeen) {
        if (at < cutoff) lastSeen.delete(ip);
    }
};
setInterval(pruneLastSeen, COOLDOWN_MS).unref();

// ufw n'accepte 80/443 que depuis les plages Cloudflare, donc CF-Connecting-IP
// ne peut pas être falsifié par un client arbitraire : rien n'atteint nginx sans
// passer par Cloudflare, qui réécrit cet en-tête.
const clientIp = (req) =>
    req.headers['cf-connecting-ip'] ||
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown';

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

// Un CR ou LF dans un champ réinjecté en en-tête (From, Reply-To, Subject)
// permettrait d'en ajouter d'autres. On les refuse plutôt que de les nettoyer.
const hasControlChars = (value) => /[\r\n]/.test(value);

const validate = (body) => {
    if (typeof body !== 'object' || body === null) return 'Requête invalide.';

    // Honeypot : invisible pour un visiteur, donc rempli seulement par un bot.
    if (body.website) return 'Requête invalide.';

    for (const field of ['name', 'email', 'message']) {
        const value = body[field];
        if (typeof value !== 'string' || !value.trim()) {
            return 'Merci de remplir tous les champs.';
        }
        if (value.length > LIMITS[field]) {
            return 'Un des champs dépasse la longueur autorisée.';
        }
    }

    if (hasControlChars(body.name) || hasControlChars(body.email)) {
        return 'Requête invalide.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return 'Adresse email invalide.';
    }

    return null;
};

// ---------------------------------------------------------------------------
// Turnstile (optionnel)
// ---------------------------------------------------------------------------

const verifyTurnstile = async (token, ip) => {
    if (!TURNSTILE_SECRET) return true; // non configuré : on n'exige rien
    if (!token) return false;

    try {
        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
        });
        const data = await res.json();
        return data.success === true;
    } catch (err) {
        console.error('[contact] vérification Turnstile impossible:', err.message);
        return false;
    }
};

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

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
        return send(res, 200, { ok: true });
    }

    if (req.method !== 'POST') {
        res.writeHead(405, { Allow: 'POST' });
        return res.end();
    }

    const ip = clientIp(req);

    const previous = lastSeen.get(ip);
    if (previous && Date.now() - previous < COOLDOWN_MS) {
        const minutes = Math.ceil((COOLDOWN_MS - (Date.now() - previous)) / 60000);
        return send(res, 429, {
            error: `Merci de patienter encore ${minutes} minute(s) avant de renvoyer un message.`,
        });
    }

    let body;
    try {
        body = JSON.parse(await readBody(req));
    } catch {
        return send(res, 400, { error: 'Requête invalide.' });
    }

    const problem = validate(body);
    if (problem) {
        // Le honeypot renvoie un succès : inutile d'apprendre au bot qu'il est repéré.
        if (body && body.website) return send(res, 200, { ok: true });
        return send(res, 400, { error: problem });
    }

    if (!(await verifyTurnstile(body.turnstileToken, ip))) {
        return send(res, 400, { error: 'Vérification anti-robot échouée, merci de réessayer.' });
    }

    try {
        await transporter.sendMail({
            from: `"Formulaire portfolio" <${SMTP_USER}>`,
            to: CONTACT_TO,
            replyTo: `${body.name.replace(/["<>]/g, '')} <${body.email}>`,
            subject: `Message de ${body.name}`,
            text: `De : ${body.name} <${body.email}>\n\n${body.message}`,
        });

        // Marqué seulement après un envoi réussi : une panne SMTP ne doit pas
        // consommer le quota du visiteur.
        lastSeen.set(ip, Date.now());
        return send(res, 200, { ok: true });
    } catch (err) {
        console.error('[contact] envoi impossible:', err.message);
        return send(res, 502, { error: 'Une erreur est survenue, veuillez réessayer plus tard.' });
    }
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`[contact] à l'écoute sur 127.0.0.1:${PORT}`);
    console.log(`[contact] Turnstile ${TURNSTILE_SECRET ? 'activé' : 'désactivé (secret absent)'}`);
});
