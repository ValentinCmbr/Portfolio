// Logique pure de l'endpoint, sans effet de bord à l'import : index.js charge
// l'environnement et ouvre le port, ce qui empêcherait de tester ces fonctions.

import { isIPv6 } from 'node:net';

const LIMITS = { name: 100, email: 150, message: 2000 };

// ---------------------------------------------------------------------------
// Identification du client
// ---------------------------------------------------------------------------

// ufw n'accepte 80/443 que depuis les plages Cloudflare, donc CF-Connecting-IP
// ne peut pas être falsifié par un client arbitraire : rien n'atteint nginx sans
// passer par Cloudflare, qui réécrit cet en-tête. Sans lui, on retombe sur
// l'adresse de la socket (nginx, donc un compteur partagé par tous) plutôt que
// sur X-Forwarded-For, dont le premier élément est choisi par le client.
export const clientIp = (req) =>
    req.headers['cf-connecting-ip'] || req.socket.remoteAddress || 'unknown';

// Un FAI attribue au moins un /64 à chaque client IPv6 : limiter l'adresse
// complète laisserait un attaquant en changer à chaque requête.
export const rateLimitKey = (ip) => {
    if (!isIPv6(ip)) return ip;

    const [head, tail] = ip.split('::');
    const left = head ? head.split(':') : [];
    const right = tail ? tail.split(':') : [];
    const groups = tail === undefined
        ? left
        : [...left, ...Array(8 - left.length - right.length).fill('0'), ...right];

    return `${groups.slice(0, 4).map((g) => parseInt(g, 16).toString(16)).join(':')}::/64`;
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

// Un CR ou LF dans un champ réinjecté en en-tête (Reply-To, Subject)
// permettrait d'en ajouter d'autres. On les refuse plutôt que de les nettoyer.
const hasControlChars = (value) => /[\r\n]/.test(value);

export const validate = (body) => {
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

// Un site tiers peut poster en `text/plain` sans preflight CORS, depuis le
// navigateur de chacun de ses visiteurs — donc depuis autant d'IP, ce qui
// contourne toute limitation par IP. Exiger du JSON impose un preflight auquel
// on ne répond pas, et l'Origin, quand le navigateur l'envoie, doit être ce
// domaine.
export const isSameOrigin = (req) => {
    const type = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (type !== 'application/json') return false;

    const origin = req.headers.origin;
    return !origin || origin === `https://${req.headers.host}`;
};
