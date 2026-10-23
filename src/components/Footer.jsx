const CONTACT_EMAIL = 'contact@valentincombier.com';

// Mentions légales (LCEN, art. 6) et information RGPD liée au formulaire de
// contact. Repliées par défaut : obligatoires, mais pas ce qu'on vient lire.
const Footer = () => (
    <footer
        className="py-4 text-center text-muted"
        style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)', fontSize: '0.85rem' }}
    >
        <div className="container text-start" style={{ maxWidth: '720px' }}>
            <details id="mentions-legales" className="mb-2">
                <summary>Mentions légales</summary>
                <p className="mt-2 mb-1">
                    <strong>Éditeur et directeur de la publication :</strong> Valentin Combier,
                    particulier — <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
                <p className="mb-1">
                    <strong>Hébergeur :</strong> OVH SAS, 2 rue Kellermann, 59100 Roubaix, France — 1007.
                </p>
                <p className="mb-0">
                    <strong>Hébergeur de secours :</strong> Vercel Inc., 440 N Barranca Ave #4133,
                    Covina, CA 91723, États-Unis.
                </p>
            </details>

            <details id="confidentialite">
                <summary>Confidentialité</summary>
                <p className="mt-2 mb-1">
                    Le formulaire de contact recueille votre nom, votre email et votre message,
                    dans le seul but de vous répondre (base légale : votre demande). Ils arrivent
                    dans ma boîte mail OVH, transférée vers Gmail, et sont supprimés au plus tard
                    3 ans après notre dernier échange. Ils ne sont ni revendus ni utilisés à
                    d'autres fins.
                </p>
                <p className="mb-1">
                    Le site ne dépose aucun cookie. La mesure d'audience (Vercel Analytics) et
                    de performance (Vercel Speed Insights) est anonyme et sans cookie. Le trafic
                    transite par Cloudflare, qui protège le site.
                </p>
                <p className="mb-0">
                    Vous pouvez demander l'accès à vos données, leur rectification ou leur
                    suppression à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, et
                    saisir la CNIL (cnil.fr) en cas de désaccord.
                </p>
            </details>

            <p className="text-center mt-3 mb-0">© {new Date().getFullYear()} Valentin Combier</p>
        </div>
    </footer>
);

export default Footer;
