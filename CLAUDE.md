# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Réponses en français.

## Commandes

Front (racine) :

```bash
npm start          # serveur de dev Vite
npm run build      # build dans dist/
npm run preview    # sert dist/
npm test           # tests du nettoyeur de /pdf/ (node --test, DOM fourni par jsdom)
```

Endpoint de contact (`server/contact`, paquet séparé avec son propre `package.json`) :

```bash
cd server/contact && npm test                          # node --test
cd server/contact && node --test --test-name-pattern="<nom>"   # un seul test
```

Pas de lint ni de formateur. Côté front, seul `src/pdf/nettoyer.js` est testé
(`src/**/*.test.mjs`) : jsdom reste en v26, la v27 exige Node 22.12 ou plus. En CI, Semgrep
(`p/javascript`, `p/react`, `p/secrets`) échoue au moindre match.

## Architecture

- **Front** : SPA React 18 + Vite sur une seule page. `App.jsx` empile les
  sections (`src/pages/*`) dans `<main>`, sans routeur ; la navigation passe
  par des ancres. Les sections sont importées directement, pas en lazy
  (choix volontaire, voir le commentaire dans `App.jsx`).
- **Thèmes** : `ThemeContext` pose `data-theme` / `data-bs-theme` (clair ou
  sombre) et `data-style` (`default`, `gradient`, `brutal`) sur `<html>`. Le CSS
  s'appuie sur ces attributs et sur des variables (`var(--bg)`…). Les polices
  Google ne sont chargées que pour les styles non par défaut.
- **Animations** : CSS uniquement (`styles/animations.css`), révélées au scroll
  via `hooks/useInViewOnce`. Respecter `prefers-reduced-motion`.
- **Formulaire de contact** : `Contact.jsx` envoie un POST JSON à
  `/api/contact`. nginx le proxifie vers `server/contact` (Node + nodemailer,
  SMTP authentifié OVH) sur `127.0.0.1:8081`. La logique pure est dans
  `lib.js`, testable sans `.env` ; `index.js` charge son `.env` lui-même, car
  PM2 ne lit pas les `.env`. Toute réponse non JSON ou 5xx est traitée côté
  client comme « indisponible » et affiche l'adresse en clair : garder ce
  contrat si l'endpoint change.

## Déploiement

- Le front est servi par le **VPS OVH**. Un push sur `master` déclenche
  `.github/workflows/deploy-vps.yml` (build puis `rsync --delete` de `dist/`).
  Vercel déploie la même branche en parallèle et sert de secours.
- Le **Worker Cloudflare `portfolio-failover`** (`deploy/failover-worker.js`,
  édité à la main dans le dashboard) bascule les GET/HEAD vers Vercel si le VPS
  ne répond pas. Les POST vont toujours au VPS : en cas de panne, le
  formulaire tombe sur son repli.
- La **config nginx et ufw** (en-têtes de sécurité, proxy `/api/contact`,
  limitation de débit, ouverture aux seules IP Cloudflare) vit dans le **dépôt
  infra privé**, pas ici. `vercel.json` ne vaut que pour Vercel : changer un
  en-tête de sécurité demande de toucher aux deux.
- **`server/contact`** est déployé sur le VPS par `sudo portfolio-deployer`
  (dépôt infra) : il récupère `master`, lance les tests, remplace
  `/opt/portfolio-contact` en gardant le `.env`, relance PM2, vérifie `/health`
  et revient à la version précédente en cas d'échec. Ne jamais copier le code
  à la main. Ce service vit hors de `/var/www/portfolio`, que le `rsync --delete`
  écraserait.

## Commits

Style Conventional Commits (`feat:`, `fix:`, `chore:`…), sans trailer
`Co-Authored-By`.
