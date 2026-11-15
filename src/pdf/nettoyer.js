// Mise au propre d'un fichier HTML de fic avant de l'afficher puis de
// l'imprimer en PDF.
//
// Le fichier vient de n'importe qui : rien n'en est recopié tel quel. Chaque
// élément est recréé à partir d'une liste blanche de balises et d'attributs,
// si bien qu'aucun script, gestionnaire d'événement, style ou formulaire du
// fichier n'arrive dans la page. Le parsing par DOMParser n'exécute rien.

// Balises supprimées avec tout leur contenu.
const RETIREES = new Set([
  'script', 'style', 'noscript', 'template', 'iframe', 'frame', 'frameset',
  'object', 'embed', 'applet', 'form', 'input', 'button', 'select', 'textarea',
  'option', 'link', 'meta', 'base', 'head', 'title', 'svg', 'math', 'canvas',
  'audio', 'video', 'source', 'track', 'picture', 'map', 'area', 'dialog',
]);

// Balises recréées. Les autres (font, nav…) sont retirées mais leur contenu
// est gardé.
const GARDEES = new Set([
  'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'i', 'strong',
  'b', 'u', 's', 'strike', 'del', 'ins', 'sub', 'sup', 'small', 'big', 'mark',
  'span', 'div', 'blockquote', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'a', 'img',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'center',
  'pre', 'code', 'kbd', 'tt', 'abbr', 'cite', 'q', 'figure', 'figcaption',
  'details', 'summary', 'section', 'article', 'header', 'footer', 'aside',
  'address',
]);

const VIDES = new Set(['br', 'hr', 'img']);
const ALIGNEMENTS = new Set(['left', 'right', 'center', 'justify']);
const NS_HTML = 'http://www.w3.org/1999/xhtml';

// Préfixe des id et classes du fichier, pour qu'ils ne se mélangent pas à ceux
// de la page.
export const PREFIXE = 'f-';

function entier(valeur, max) {
  const n = Number.parseInt(valeur, 10);
  return Number.isInteger(n) && n >= 0 && n <= max ? String(n) : null;
}

function propre(texte) {
  return (texte ?? '').replace(/\s+/g, ' ').trim();
}

// Identifiants gardés (sinon retirés) : les ancres ne pointent que vers eux.
const ID_VALIDE = /^[\w:.-]{1,80}$/;
// Langue du fichier, reprise sur l'aperçu pour la voix du lecteur d'écran.
const LANGUE_VALIDE = /^[a-z]{2,3}(-[a-z0-9]{1,8})*$/i;

function lienSur(href) {
  if (!href) return null;
  if (href.startsWith('#')) {
    // « # » seul ou cible dont l'id n'a pas été gardé : l'ancre mènerait nulle part.
    let cible;
    try {
      cible = decodeURIComponent(href.slice(1));
    } catch {
      return null;
    }
    return ID_VALIDE.test(cible) ? `#${PREFIXE}${cible}` : null;
  }
  try {
    const url = new URL(href);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    // Lien relatif : il pointerait vers ce site, pas vers celui d'origine.
    return null;
  }
}

function imageSure(src) {
  if (!src) return null;
  if (/^data:image\/(png|jpe?g|gif|webp);/i.test(src)) return src;
  try {
    const url = new URL(src);
    if (url.protocol === 'http:') url.protocol = 'https:';
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function copierAttributs(source, cible, balise) {
  // Classes du fichier préfixées comme les id : une classe « d-none » ou
  // « card » ne doit pas recevoir les styles Bootstrap du portfolio.
  const classes = [];
  for (const c of source.classList) {
    if (/^[a-z][\w-]{0,40}$/i.test(c)) classes.push(PREFIXE + c);
  }
  const style = source.getAttribute('style') ?? '';
  const alignement = balise === 'center'
    ? 'center'
    : (source.getAttribute('align') ?? style.match(/text-align\s*:\s*([a-z]+)/i)?.[1] ?? '').toLowerCase();
  if (ALIGNEMENTS.has(alignement)) classes.push(`aligne-${alignement}`);
  if (classes.length) cible.className = classes.join(' ');

  const id = source.getAttribute('id');
  if (id && ID_VALIDE.test(id)) cible.id = PREFIXE + id;
  for (const nom of ['title', 'lang']) {
    const valeur = source.getAttribute(nom);
    if (valeur) cible.setAttribute(nom, valeur.slice(0, 200));
  }
  const dir = source.getAttribute('dir');
  if (dir === 'ltr' || dir === 'rtl' || dir === 'auto') cible.setAttribute('dir', dir);

  if (balise === 'a') {
    const href = lienSur(source.getAttribute('href'));
    if (href) {
      cible.setAttribute('href', href);
      if (!href.startsWith('#')) {
        cible.setAttribute('target', '_blank');
        cible.setAttribute('rel', 'noopener noreferrer');
      }
    }
  } else if (balise === 'img') {
    const src = imageSure(source.getAttribute('src'));
    // Une image distante préviendrait l'auteur du fichier (IP, navigateur) dès
    // l'ouverture : elle attend que le visiteur demande à la charger.
    if (src) cible.setAttribute(/^data:/i.test(src) ? 'src' : 'data-src', src);
    cible.setAttribute('alt', source.getAttribute('alt') ?? '');
    cible.setAttribute('referrerpolicy', 'no-referrer');
    for (const nom of ['width', 'height']) {
      const valeur = entier(source.getAttribute(nom), 5000);
      if (valeur) cible.setAttribute(nom, valeur);
    }
  } else if (balise === 'details') {
    // Toujours ouvert : un bloc replié (avertissements, notes, scène cachée)
    // n'imprimerait que son titre.
    cible.setAttribute('open', '');
  } else if (balise === 'td' || balise === 'th') {
    for (const nom of ['colspan', 'rowspan']) {
      const valeur = entier(source.getAttribute(nom), 100);
      if (valeur) cible.setAttribute(nom, valeur);
    }
  } else if (balise === 'ol') {
    const start = entier(source.getAttribute('start'), 100000);
    if (start) cible.setAttribute('start', start);
    const type = source.getAttribute('type');
    if (['1', 'a', 'A', 'i', 'I'].includes(type)) cible.setAttribute('type', type);
  }
}

// Compte nœud de texte par nœud de texte : textContent colle le dernier mot
// d'un paragraphe au premier du suivant quand rien ne les sépare dans le HTML.
function compterMots(noeud) {
  if (noeud.nodeType === 3) return noeud.data.split(/\s+/).filter(Boolean).length;
  let total = 0;
  for (const enfant of noeud.childNodes) total += compterMots(enfant);
  return total;
}

function copier(noeud, parent, doc) {
  if (noeud.nodeType === 3) {
    parent.appendChild(doc.createTextNode(noeud.data));
    return;
  }
  if (noeud.nodeType !== 1 || noeud.namespaceURI !== NS_HTML) return;
  const balise = noeud.localName;
  if (RETIREES.has(balise)) return;
  // Image sans source utilisable : rien à afficher.
  if (balise === 'img' && !imageSure(noeud.getAttribute('src'))) return;

  let cible = parent;
  if (GARDEES.has(balise)) {
    cible = doc.createElement(balise === 'center' ? 'div' : balise);
    copierAttributs(noeud, cible, balise);
    parent.appendChild(cible);
    if (VIDES.has(balise)) return;
  }
  for (const enfant of noeud.childNodes) copier(enfant, cible, doc);
}

/**
 * Lit le HTML d'une fic et le recrée proprement dans `doc`.
 * Les deux dépendances sont passées pour pouvoir tester hors navigateur.
 * @returns {{ titre: string, auteur: string, langue: string, contenu: DocumentFragment, mots: number, chapitres: number, imagesDistantes: number }}
 */
export function nettoyerFic(html, { document: doc, DOMParser: Parser }) {
  const source = new Parser().parseFromString(html, 'text/html');
  const contenu = doc.createDocumentFragment();
  for (const enfant of source.body.childNodes) copier(enfant, contenu, doc);

  const titre = propre(source.querySelector('h1')?.textContent) || propre(source.title);
  const auteur = propre(source.querySelector('[rel="author"]')?.textContent);
  const langue = source.documentElement.getAttribute('lang') ?? source.body.getAttribute('lang') ?? '';
  // Mots comptés sur la copie nettoyée : le texte des scripts et styles du
  // fichier n'y est plus.
  const corps = contenu.querySelector(`#${PREFIXE}chapters`) ?? contenu;
  const mots = compterMots(corps);
  const chapitres = source.querySelectorAll('#chapters h2').length;
  const imagesDistantes = contenu.querySelectorAll('img[data-src]').length;
  return { titre, auteur, langue: LANGUE_VALIDE.test(langue) ? langue : '', contenu, mots, chapitres, imagesDistantes };
}
