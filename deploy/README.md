# Hébergement VPS avec bascule (failover) vers Vercel — checklist de mise en place

Objectif : `your-domain.tld` sert le portfolio depuis ton VPS OVH. Si le VPS
ne répond plus, les visiteurs récupèrent automatiquement la copie déjà
déployée sur Vercel — sans attendre le DNS, puisque la bascule se fait à
chaque requête dans un Worker Cloudflare. 100% gratuit (plan gratuit
Cloudflare + ton VPS déjà payé + le plan gratuit de Vercel).

## 1. Passer le DNS chez Cloudflare (le domaine reste enregistré chez OVH)

1. Sur la page d'accueil du dashboard Cloudflare ("What's on the agenda?"),
   carte du milieu **"Add a domain"** -> tape `your-domain.tld` dans le
   champ -> suis le flow -> plan **Free**. (Ce bouton s'est déjà appelé
   "Add a site" puis "Onboard a domain" ; le libellé peut encore changer
   selon la version du dashboard.)
2. Cloudflare scanne et importe tes enregistrements DNS existants —
   **vérifie chacun d'eux par rapport à ta zone DNS OVH avant de continuer**,
   en particulier les enregistrements `MX` / `TXT` si tu as des emails sur
   ce domaine. Ajoute ce qui manque.
3. Ajoute/confirme un enregistrement `A` : `your-domain.tld` -> l'IP
   publique de ton VPS, proxifié (nuage orange activé).
4. Cloudflare te donne deux serveurs de noms. Dans le manager OVH : domaine
   -> your-domain.tld -> Serveurs DNS -> passer en "externe" et entrer ces
   deux serveurs. La propagation prend généralement moins d'une heure,
   parfois jusqu'à 24h.
5. Une fois que Cloudflare affiche la zone comme "active", tu es
   entièrement passé sur le DNS Cloudflare.

## 2. VPS : servir le site

1. `sudo mkdir -p /var/www/portfolio && sudo chown $USER /var/www/portfolio`
2. Dashboard Cloudflare -> SSL/TLS -> Overview -> passer le mode de
   chiffrement en **Full (strict)**.
3. Dashboard Cloudflare -> SSL/TLS -> Origin Server -> Create Certificate
   (les valeurs par défaut conviennent, validité 15 ans). Enregistre les
   deux fichiers générés sur le VPS :
   - `/etc/nginx/ssl/cloudflare-origin.pem` (certificat)
   - `/etc/nginx/ssl/cloudflare-origin.key` (clé privée)
4. Installe `portfolio.nginx.conf` depuis ce dossier (voir le commentaire
   en haut de ce fichier pour les commandes exactes), après avoir remplacé
   `your-domain.tld` par ton vrai domaine.
5. `sudo nginx -t && sudo systemctl reload nginx`

## 3. GitHub Actions : déploiement automatique sur le VPS

`.github/workflows/deploy-vps.yml` (déjà ajouté) build le site et envoie
`dist/` sur le VPS via rsync à chaque push sur `master` — le même
déclencheur que Vercel utilise déjà, donc les deux restent synchronisés
automatiquement.

Dans les réglages du repo -> Secrets and variables -> Actions, ajoute :

| Secret | Valeur |
|---|---|
| `VPS_HOST` | IP ou nom d'hôte du VPS |
| `VPS_USER` | Utilisateur SSH ayant accès en écriture à `/var/www/portfolio` |
| `VPS_SSH_KEY` | Clé privée d'une **clé de déploiement dédiée** (voir ci-dessous) |
| `VPS_TARGET_PATH` | `/var/www/portfolio/` |
| `VITE_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` | mêmes valeurs que ton `.env.local` local |

Génère une clé dédiée au déploiement plutôt que de réutiliser ta clé
personnelle :
```
ssh-keygen -t ed25519 -f deploy_key -N ""
```
Ajoute `deploy_key.pub` dans le `~/.ssh/authorized_keys` de l'utilisateur
sur le VPS, et colle le contenu de `deploy_key` (la clé privée) dans le
secret `VPS_SSH_KEY`.

## 4. Worker Cloudflare : la bascule à proprement parler

`failover-worker.js` dans ce dossier. Les étapes de mise en place sont
dans le commentaire en haut de ce fichier. C'est ce qui rend la bascule
vers Vercel instantanée, requête par requête, au lieu d'attendre le TTL DNS.

## Dans quel ordre faire tout ça

Les étapes 2 et 3 ne dépendent pas du DNS — fais-les d'abord et vérifie
que le VPS sert bien le site correctement via son IP brute (ou une entrée
`/etc/hosts` temporaire) avant de toucher à l'étape 1. Fais ensuite
l'étape 1, puis l'étape 4 en dernier, pour que le Worker ne passe en
production que quand l'origine qu'il est censé protéger fonctionne déjà.
