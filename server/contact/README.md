# Endpoint du formulaire de contact

Remplace EmailJS. Les identifiants ne sont plus substitués dans le bundle où
n'importe qui pouvait les relire : ils vivent ici, sur le VPS. Conséquence
directe, le honeypot et la limitation de débit s'appliquent côté serveur, là où
un client qui n'utilise pas de navigateur ne peut pas les sauter.

L'envoi passe par un **SMTP authentifié**, pas par un MTA local sur le VPS. Le
SPF du domaine est `v=spf1 include:mx.ovh.com -all` : un envoi depuis l'IP du
VPS échouerait la vérification et finirait en indésirables.

## Prérequis

- Node ≥ 18 (le `fetch` natif sert à la vérification Turnstile)
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
| Délai de 5 min par IP | serveur, en mémoire | non |
| Limitation nginx `10r/m` | en amont de Node | non |
| Taille du corps (16 ko) | nginx + Node | non |
| Longueur des champs | serveur | non |
| Refus des CR/LF dans nom et email | serveur | non |
| Turnstile | serveur, optionnel | non |

Le refus des retours chariot n'est pas cosmétique : le nom et l'email sont
réinjectés dans les en-têtes `Reply-To` et `Subject`, et un CR permettrait d'en
injecter d'autres.

Le délai par IP n'est enregistré **qu'après un envoi réussi** — une panne SMTP
ne doit pas consommer le quota du visiteur.

L'IP est lue depuis `CF-Connecting-IP`. C'est fiable ici parce qu'ufw n'accepte
80/443 que depuis les plages Cloudflare : rien n'atteint nginx sans passer par
Cloudflare, qui réécrit cet en-tête.

## Activer Turnstile (optionnel)

Tant que `TURNSTILE_SECRET` est vide, la vérification est désactivée et
l'endpoint fonctionne normalement. Pour l'activer :

1. Cloudflare → Turnstile → créer un widget pour le domaine
2. Coller la *secret key* dans `TURNSTILE_SECRET`, puis `pm2 restart portfolio-contact`
3. Côté front, charger le script du widget et envoyer son jeton dans le champ
   `turnstileToken` du corps JSON
4. Ajouter à la CSP (dans `index.html` **et** `vercel.json`) :
   `script-src` et `frame-src` → `https://challenges.cloudflare.com`

L'étape 3 n'est pas encore faite dans `src/pages/Contact.jsx` : le serveur sait
vérifier un jeton, le front n'en produit pas encore.

## Pendant une bascule vers Vercel

Le Worker Cloudflare bascule sur Vercel quand le VPS ne répond plus. Vercel n'a
pas cet endpoint et renvoie 404 ; le formulaire affiche alors l'adresse en clair
plutôt qu'une erreur sans issue. C'est la contrepartie assumée du relais SMTP :
un Worker ne peut pas ouvrir de socket TCP, donc l'endpoint doit vivre sur le
VPS. Y échapper supposerait de passer par l'API HTTP d'un service tiers, ce
qu'on cherchait précisément à éviter en quittant EmailJS.
