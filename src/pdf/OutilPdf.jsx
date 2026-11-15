// Page /pdf/ : met en page une fic téléchargée en HTML, puis passe par
// l'impression du navigateur pour l'enregistrer en PDF. Aucun serveur : le
// fichier ne quitte pas le navigateur.
import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import ThemeControls from '../components/ThemeControls';
import Footer from '../components/Footer';
import { nettoyerFic } from './nettoyer.js';

const FORMATS = {
    a4: { page: 'A4', marges: '22mm 24mm 24mm', largeur: '38em', tailles: { petit: '10.5pt', normal: '12pt', grand: '13.5pt' } },
    a5: { page: 'A5', marges: '16mm 15mm 18mm', largeur: '30em', tailles: { petit: '9.5pt', normal: '10.5pt', grand: '12pt' } },
    // Proche d'un écran de liseuse ou de téléphone tenu en hauteur.
    ecran: { page: '90mm 135mm', marges: '7mm 6mm 9mm', largeur: '22em', tailles: { petit: '8.5pt', normal: '9.5pt', grand: '11pt' } },
};

const POLICES = {
    serif: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
    sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const CHOIX = [
    { nom: 'format', legende: 'Format', options: [['a4', 'A4, comme le PDF du site'], ['a5', 'Livre (A5)'], ['ecran', 'Liseuse, téléphone']] },
    { nom: 'taille', legende: 'Taille du texte', options: [['petit', 'Petite'], ['normal', 'Normale'], ['grand', 'Grande']] },
    { nom: 'police', legende: 'Police', options: [['serif', 'Classique'], ['sans', 'Moderne']] },
];

const REGLAGES_INITIAUX = { format: 'a4', taille: 'normal', police: 'serif', sauts: true, infos: true };

function nomDeFichier(texte) {
    return texte.replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
}

function lireFichier(fichier, html) {
    const fic = nettoyerFic(html, { document, DOMParser });
    if (!fic.contenu.textContent.trim()) throw new Error('vide');
    const infos = [];
    if (fic.chapitres > 1) infos.push(`${fic.chapitres} chapitres`);
    if (fic.mots) infos.push(`environ ${fic.mots.toLocaleString('fr-FR')} mots`);
    return {
        ...fic,
        nomFichier: fichier.name,
        nomPdf: nomDeFichier([fic.titre, fic.auteur].filter(Boolean).join(' - '))
            || nomDeFichier(fichier.name.replace(/\.x?html?$/i, '')),
        resume: [fic.titre, ...infos].filter(Boolean).join(' · '),
    };
}

const Etape = ({ numero, titre, children }) => (
    <section className="card border-0 theme-card o-etape" style={{ backgroundColor: 'var(--card-bg)' }} aria-labelledby={`etape-${numero}`}>
        <div className="card-body">
            <h2 id={`etape-${numero}`} className="h5 fw-bold mb-3">
                <span className="badge badge-pill-custom rounded-pill">{numero}</span>{' '}{titre}
            </h2>
            {children}
        </div>
    </section>
);

const Outil = () => {
    const [fic, setFic] = useState(null);
    const [erreur, setErreur] = useState(null);
    const [survol, setSurvol] = useState(false);
    const [reglages, setReglages] = useState(REGLAGES_INITIAUX);
    const livre = useRef(null);

    // Le contenu nettoyé est un fragment DOM, posé tel quel dans l'aperçu. Le
    // fragment se vide en y entrant : le second passage du StrictMode ne fait rien.
    useEffect(() => {
        if (fic && livre.current && fic.contenu.childNodes.length) {
            livre.current.replaceChildren(fic.contenu);
        }
    }, [fic]);

    // Format de page et numéros en bas (Chrome, Edge, Safari récents), sauf
    // sur la première page.
    useEffect(() => {
        const format = FORMATS[reglages.format];
        const style = document.createElement('style');
        style.textContent = `@page { size: ${format.page}; margin: ${format.marges};`
            + ' @bottom-center { content: counter(page); font-size: 8pt; color: #666; } }'
            + ' @page :first { @bottom-center { content: none; } }';
        document.head.appendChild(style);
        return () => style.remove();
    }, [reglages.format]);

    const charger = async (fichier) => {
        setErreur(null);
        if (!fichier) return;
        if (!/\.x?html?$/i.test(fichier.name) && fichier.type !== 'text/html') {
            setErreur(`« ${fichier.name} » n'est pas un fichier HTML. Sur le site de la fic, choisis le téléchargement « HTML ».`);
            return;
        }
        if (fichier.size > 60 * 1024 * 1024) {
            setErreur('Ce fichier est trop gros (plus de 60 Mo).');
            return;
        }
        try {
            setFic(lireFichier(fichier, await fichier.text()));
        } catch {
            setErreur("Impossible de lire ce fichier. Est-ce bien le fichier HTML d'origine ?");
        }
    };

    const regler = (nom, valeur) => setReglages((r) => ({ ...r, [nom]: valeur }));

    // Le navigateur propose le titre de la page comme nom du PDF.
    const imprimer = () => {
        const titre = document.title;
        document.title = fic.nomPdf || titre;
        window.addEventListener('afterprint', () => { document.title = titre; }, { once: true });
        window.print();
    };

    const format = FORMATS[reglages.format];
    const classesLivre = ['o-livre', reglages.sauts && 'o-sauts', !reglages.infos && 'o-sans-infos'].filter(Boolean).join(' ');

    return (
        <main id="main" className="container o-outil">
            <header className="mb-4">
                <h1 className="fw-bold mb-2">Transformer un fichier HTML en PDF</h1>
                <p className="text-muted mb-0">
                    Choisis le fichier d'une fic téléchargée en HTML. Tout se passe dans ton navigateur : le fichier n'est envoyé nulle part.
                </p>
            </header>

            <Etape numero={1} titre="Le fichier">
                <label
                    className={`o-depot${survol ? ' o-survol' : ''}${fic ? ' o-charge' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setSurvol(true); }}
                    onDragLeave={() => setSurvol(false)}
                    onDrop={(e) => { e.preventDefault(); setSurvol(false); charger(e.dataTransfer.files[0]); }}
                >
                    <span className="fw-semibold">{fic ? fic.nomFichier : 'Choisir un fichier .html'}</span>
                    <span className="text-muted small">{fic ? 'Changer de fichier, ou en glisser un autre ici' : 'ou le glisser ici'}</span>
                    <input
                        type="file"
                        accept=".html,.htm,text/html"
                        className="visually-hidden"
                        onChange={(e) => charger(e.target.files[0])}
                    />
                </label>
                {erreur && <p className="o-erreur mt-3 mb-0" role="alert">{erreur}</p>}
            </Etape>

            {fic && (
                <>
                    <Etape numero={2} titre="La mise en page">
                        <div className="o-reglages">
                            {CHOIX.map(({ nom, legende, options }) => (
                                <fieldset key={nom}>
                                    <legend>{legende}</legend>
                                    <div className="d-flex flex-wrap gap-2">
                                        {options.map(([valeur, libelle]) => (
                                            <label key={valeur} className="o-option theme-pill">
                                                <input
                                                    type="radio"
                                                    name={nom}
                                                    value={valeur}
                                                    checked={reglages[nom] === valeur}
                                                    onChange={() => regler(nom, valeur)}
                                                    className="visually-hidden"
                                                />
                                                {libelle}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            ))}
                            <fieldset>
                                <legend>Options</legend>
                                <label className="o-case">
                                    <input type="checkbox" checked={reglages.sauts} onChange={(e) => regler('sauts', e.target.checked)} />
                                    Chaque chapitre sur une nouvelle page
                                </label>
                                <label className="o-case">
                                    <input type="checkbox" checked={reglages.infos} onChange={(e) => regler('infos', e.target.checked)} />
                                    Garder les tags et les infos de publication
                                </label>
                            </fieldset>
                        </div>
                    </Etape>

                    <Etape numero={3} titre="Le PDF">
                        <div className="d-flex flex-wrap align-items-center gap-3">
                            <button type="button" className="btn btn-dark px-4" onClick={imprimer}>Enregistrer en PDF</button>
                            <p className="text-muted small mb-0 o-resume">{fic.resume}</p>
                        </div>
                        <details className="o-aide mt-3">
                            <summary>Comment enregistrer le PDF</summary>
                            <ul className="mt-2 mb-0">
                                <li><strong>Ordinateur</strong> : dans la fenêtre d'impression, choisis « Enregistrer au format PDF » comme imprimante. Si l'adresse du site apparaît en haut des pages, décoche « En-têtes et pieds de page ».</li>
                                <li><strong>Android</strong> : en haut de la fenêtre d'impression, choisis « Enregistrer au format PDF », puis appuie sur le bouton PDF.</li>
                                <li><strong>iPhone, iPad</strong> : dans « Options d'impression », appuie sur le bouton de partage en haut, puis « Enregistrer dans Fichiers ».</li>
                            </ul>
                        </details>
                    </Etape>

                    <div className="o-apercu">
                        <p className="o-legende">Aperçu</p>
                        <article
                            ref={livre}
                            className={classesLivre}
                            style={{
                                '--taille': format.tailles[reglages.taille],
                                '--largeur': format.largeur,
                                '--police': POLICES[reglages.police],
                            }}
                        />
                    </div>
                </>
            )}
        </main>
    );
};

const OutilPdf = () => (
    <ThemeProvider>
        <a href="#main" className="skip-link visually-hidden-focusable">Aller au contenu</a>
        <nav className="navbar fixed-top shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border)' }}>
            <div className="container">
                <a className="navbar-brand" href="/" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Valentin</a>
                <ThemeControls />
            </div>
        </nav>
        <Outil />
        <Footer />
    </ThemeProvider>
);

export default OutilPdf;
