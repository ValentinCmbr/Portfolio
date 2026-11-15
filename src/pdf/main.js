// Page /pdf/ : met en page une fic téléchargée en HTML, puis passe par
// l'impression du navigateur pour l'enregistrer en PDF. Aucun serveur.
import './pdf.css';
import { nettoyerFic } from './nettoyer.js';

const FORMATS = {
  a5: { page: 'A5', marges: '16mm 15mm 18mm', largeur: '30em', tailles: { petit: '9.5pt', normal: '10.5pt', grand: '12pt' } },
  a4: { page: 'A4', marges: '22mm 24mm 24mm', largeur: '38em', tailles: { petit: '10.5pt', normal: '12pt', grand: '13.5pt' } },
  // Proche d'un écran de liseuse ou de téléphone tenu en hauteur.
  ecran: { page: '90mm 135mm', marges: '7mm 6mm 9mm', largeur: '22em', tailles: { petit: '8.5pt', normal: '9.5pt', grand: '11pt' } },
};

const POLICES = {
  serif: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
  sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const $ = (id) => document.getElementById(id);
const champ = $('fichier');
const zone = $('zone-depot');
const nomFichier = $('nom-fichier');
const erreur = $('erreur');
const formulaire = $('formulaire');
const livre = $('livre');
const resume = $('resume');
const stylePage = $('style-page');
const titrePage = document.title;
let nomPdf = '';

function montrerErreur(message) {
  erreur.textContent = message;
  erreur.hidden = false;
}

function nomDeFichier(texte) {
  return texte.replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
}

function appliquer() {
  const donnees = new FormData(formulaire);
  const format = FORMATS[donnees.get('format')] ?? FORMATS.a4;
  livre.style.setProperty('--taille', format.tailles[donnees.get('taille')] ?? format.tailles.normal);
  livre.style.setProperty('--largeur', format.largeur);
  livre.style.setProperty('--police', POLICES[donnees.get('police')] ?? POLICES.serif);
  livre.classList.toggle('o-sauts', donnees.has('sauts'));
  livre.classList.toggle('o-sans-infos', !donnees.has('infos'));
  // Numéro en bas de page (Chrome, Edge, Safari récents), pas sur la première.
  stylePage.textContent = `@page { size: ${format.page}; margin: ${format.marges};`
    + ' @bottom-center { content: counter(page); font-size: 8pt; color: #666; } }'
    + ' @page :first { @bottom-center { content: none; } }';
}

async function charger(fichier) {
  erreur.hidden = true;
  if (!fichier) return;
  if (!/\.x?html?$/i.test(fichier.name) && fichier.type !== 'text/html') {
    montrerErreur(`« ${fichier.name} » n'est pas un fichier HTML. Sur le site de la fic, choisis le téléchargement « HTML ».`);
    return;
  }
  if (fichier.size > 60 * 1024 * 1024) {
    montrerErreur('Ce fichier est trop gros (plus de 60 Mo).');
    return;
  }

  let fic;
  try {
    fic = nettoyerFic(await fichier.text(), { document, DOMParser });
  } catch {
    montrerErreur("Impossible de lire ce fichier. Est-ce bien le fichier HTML d'origine ?");
    return;
  }
  if (!fic.contenu.textContent.trim()) {
    montrerErreur('Ce fichier ne contient aucun texte.');
    return;
  }

  livre.replaceChildren(fic.contenu);
  nomFichier.textContent = fichier.name;
  zone.classList.add('o-charge');
  nomPdf = nomDeFichier([fic.titre, fic.auteur].filter(Boolean).join(' - '))
    || nomDeFichier(fichier.name.replace(/\.x?html?$/i, ''));
  const infos = [];
  if (fic.chapitres > 1) infos.push(`${fic.chapitres} chapitres`);
  if (fic.mots) infos.push(`environ ${fic.mots.toLocaleString('fr-FR')} mots`);
  resume.textContent = [fic.titre, ...infos].filter(Boolean).join(' · ');

  $('reglages').hidden = false;
  $('etape-pdf').hidden = false;
  appliquer();
}

champ.addEventListener('change', () => charger(champ.files[0]));
formulaire.addEventListener('change', appliquer);

zone.addEventListener('dragover', (e) => {
  e.preventDefault();
  zone.classList.add('o-survol');
});
zone.addEventListener('dragleave', () => zone.classList.remove('o-survol'));
zone.addEventListener('drop', (e) => {
  e.preventDefault();
  zone.classList.remove('o-survol');
  charger(e.dataTransfer.files[0]);
});

// Le navigateur propose le titre de la page comme nom du PDF.
$('imprimer').addEventListener('click', () => {
  document.title = nomPdf || titrePage;
  window.print();
});
window.addEventListener('afterprint', () => {
  document.title = titrePage;
});
