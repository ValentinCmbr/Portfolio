# Endpoint du formulaire de contact

Remplace EmailJS. Les identifiants ne sont plus substitués dans le bundle où
n'importe qui pouvait les relire : ils vivent ici, sur le VPS. Conséquence
directe, le honeypot et la limitation de débit s'appliquent côté serveur, là où
un client qui n'utilise pas de navigateur ne peut pas les sauter.

L'envoi passe par un **SMTP authentifié**, pas par un MTA local sur le VPS. Le
SPF du domaine est `v=spf1 include:mx.ovh.com -all` : un envoi depuis l'IP du
VPS échouerait la vérification et finirait en indésirables.

## Prérequis

- Node ≥ 20.12 (`process.loadEnvFile` charge le `.env`) — vérifier avec
  `node --version` sur le VPS
- PM2, déjà présent sur le VPS (`pm2-botmsd.service`)
- **Un compte SMTP avec un mot de passe** — voir ci-dessous

## Choisir le compte d'envoi

L'offre MX Plan actuelle du domaine est **`redirect`** : quota de comptes emails
à `0 / 0`, et 1000 redirections. Une redirection n'a ni compte ni mot de passe,
**il n'y a donc rien avec quoi s'authentifier** sur `ssl0.ovh.net`. Il faut donc
l'une des deux options suivantes.

### A. Boîte OVH sur le domaine

Passer le MX Plan à une offre incluant des comptes email (quelques euros par
an). L'expéditeur devient `contact@valentincombier.com`, ce qui est aligné avec
le SPF existant sans toucher au DNS. C'est la version la plus propre : le
message part du domaine.

```ini
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_USER=contact@valentincombier.com
```

### B. Gmail avec un mot de passe d'application

Gratuit, avec ce que tu as déjà. Il faut la double authentification activée,
puis générer un mot de passe d'application dédié (jamais ton mot de passe de
compte). Limite d'envoi largement au-dessus des besoins d'un formulaire.

```ini
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=<ton-adresse>@gmail.com
```

**Important :** avec cette option, l'expéditeur doit rester l'adresse Gmail.
Mettre `contact@valentincombier.com` en `SMTP_USER` ferait échouer le SPF du
domaine, qui est en `-all` et n'autorise qu'OVH. Ce n'est pas gênant en
pratique : le message ne va qu'à toi, et le `Reply-To` porte l'adresse du
visiteur, donc répondre fonctionne normalement.

### Dans les deux cas

Crée la redirection `contact@valentincombier.com` vers ta boîte (tu as 1000
emplacements libres) : c'est l'adresse affichée en repli par le formulaire quand
le VPS est injoignable, et elle doit recevoir pour de vrai.

## Installation

Le service vit **hors** de `/var/www/portfolio` : le workflow de déploiement
fait un `rsync --delete` sur ce dossier et effacerait tout ce qui s'y trouve.

```bash
sudo mkdir -p /opt/portfolio-contact
sudo chown $USER /opt/portfolio-contact
# depuis ta machine :
rsync -av server/contact/ <user>@<vps>:/opt/portfolio-contact/

# sur le VPS :
cd /opt/portfolio-contact
npm install --omit=dev
cp .env.example .env
$EDITOR .env          # renseigner SMTP_USER, SMTP_PASS, CONTACT_TO

pm2 start index.js --name portfolio-contact
pm2 save
```

PM2 ne lit pas les fichiers `.env` : c'est `index.js` qui charge celui posé à
côté de lui, quel que soit le dossier depuis lequel le service est lancé.

`pm2 save` est ce qui fait repartir le service au reboot, via l'unité systemd
PM2 déjà installée pour ton bot. Sans lui, le service ne survit pas au
redémarrage.

Puis le proxy nginx, déjà présent dans `deploy/portfolio.nginx.conf` :

```bash
sudo nginx -t && sudo systemctl reload nginx
curl -s https://valentincombier.com/api/contact -X POST \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"toi@exemple.fr","message":"Essai"}'
```

Le service expose aussi `GET /health` en local, pratique pour vérifier qu'il
tourne sans envoyer de mail :

```bash
curl -s 127.0.0.1:8081/health
```

## Ce qui protège l'endpoint

| Contrôle | Où | Contournable ? |
| --- | --- | --- |
| Honeypot `website` | serveur | non |
| `Content-Type: application/json` exigé | serveur | non |
| `Origin` vérifiée contre `ALLOWED_ORIGIN` quand le navigateur l'envoie | serveur | oui, hors navigateur (l'en-tête peut être omis) |
| Délai de 5 min par IP | serveur, en mémoire | non |
| Limitation nginx `10r/m` (répond 429) | en amont de Node | non |
| Taille du corps (16 ko) | nginx + Node | non |
| Longueur des champs | serveur | non |
| Refus des CR/LF dans nom et email | serveur | non |

Le refus des retours chariot n'est pas cosmétique : le nom et l'email sont
réinjectés dans les en-têtes `Reply-To` et `Subject`, et un CR permettrait d'en
injecter d'autres.

Exiger du JSON n'est pas cosmétique non plus : un site tiers pourrait sinon
poster en `text/plain`, sans preflight CORS, depuis le navigateur de chacun de
ses visiteurs, donc depuis autant d'IP que de visiteurs.

Le créneau d'une IP est réservé **dès l'arrivée de la requête**, pour que des
envois simultanés ne passent pas tous la vérification, puis rendu si rien n'est
parti : une erreur de saisie ou une panne SMTP ne consomme pas le quota du
visiteur.

L'IP est lue depuis `CF-Connecting-IP`. C'est fiable ici parce qu'ufw n'accepte
80/443 que depuis les plages Cloudflare : rien n'atteint nginx sans passer par
Cloudflare, qui réécrit cet en-tête. Repli quand il manque et regroupement des
IPv6 par /64 : voir `clientIp` et `rateLimitKey` dans `lib.js`.

## Tests

```bash
npm test
```

La logique pure (validation, origine, clé de limitation) vit dans `lib.js` pour
être testable sans charger le `.env` ni ouvrir le port.

## Pendant une bascule vers Vercel

Le Worker Cloudflare bascule sur Vercel quand le VPS ne répond plus, mais
seulement pour les GET : le POST du formulaire part toujours vers le VPS, parce
qu'un corps de requête ne se lit qu'une fois et que Vercel n'a de toute façon
pas cet endpoint. VPS tombé, service Node arrêté ou SMTP en panne, le
formulaire reçoit une erreur 5xx (ou une page HTML) et affiche alors l'adresse
en clair plutôt qu'une erreur sans issue. C'est la contrepartie assumée du relais SMTP :
un Worker ne peut pas ouvrir de socket TCP, donc l'endpoint doit vivre sur le
VPS. Y échapper supposerait de passer par l'API HTTP d'un service tiers, ce
qu'on cherchait précisément à éviter en quittant EmailJS.
