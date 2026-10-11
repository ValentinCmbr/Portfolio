import { useRef, useState } from 'react';
import useInViewOnce from '../hooks/useInViewOnce';

const ENDPOINT = '/api/contact';
const FALLBACK_EMAIL = 'contact@valentincombier.com';

const Contact = () => {
    const form = useRef();
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    // Quand l'endpoint ne peut pas envoyer (VPS ou service tombé, bascule vers
    // Vercel), on affiche l'adresse en clair plutôt qu'une erreur sans issue.
    const [unavailable, setUnavailable] = useState(false);
    const [ref, inView] = useInViewOnce();

    const sendMessage = async (e) => {
        e.preventDefault();
        setError(null);
        setSending(true);

        const data = Object.fromEntries(new FormData(form.current));

        try {
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            // null quand la réponse n'est pas du JSON : page d'erreur de nginx
            // ou de Cloudflare, ou index.html servi par Vercel.
            const payload = await res.json().catch(() => null);

            if (res.ok && payload?.ok) {
                setSent(true);
            } else if (res.status === 429) {
                // nginx répond aussi en 429, avec une page HTML sans message.
                setError(payload?.error || 'Trop de messages envoyés, merci de patienter quelques minutes.');
            } else if (res.status < 500 && payload?.error) {
                setError(payload.error);
            } else {
                // Tout le reste veut dire que l'endpoint ne peut pas envoyer :
                // origine tombée (52x), service Node arrêté (502), SMTP en panne,
                // ou bascule vers Vercel (404).
                setUnavailable(true);
            }
        } catch {
            // Échec réseau : l'origine est injoignable.
            setUnavailable(true);
        } finally {
            setSending(false);
        }
    };

    return (
        <section id="contact" className="py-5 text-center" style={{backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)'}}>
            <div ref={ref} className={`container reveal${inView ? ' is-visible' : ''}`}>
                <h2 className="fw-bold mb-4">Me contacter</h2>

                {unavailable ? (
                    <div className="alert alert-warning mx-auto" style={{ maxWidth: '600px' }} role="alert">
                        Le formulaire est momentanément indisponible. Écrivez-moi directement à{' '}
                        <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>.
                    </div>
                ) : sent ? (
                    <div className="alert alert-success" role="status">Message bien envoyé, merci ! ✅</div>
                ) : (
                    <form ref={form} onSubmit={sendMessage} className="mx-auto" style={{ maxWidth: '600px' }}>
                        <input
                            type="text"
                            name="website"
                            style={{ display: 'none' }}
                            tabIndex="-1"
                            autoComplete="off"
                            aria-hidden="true"
                        />

                        <div className="mb-3 text-start">
                            <label htmlFor="contact-name" className="form-label">Nom</label>
                            <input id="contact-name" type="text" name="name" className="form-control" required maxLength={100} autoComplete="name" />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="contact-email" className="form-label">Email</label>
                            <input id="contact-email" type="email" name="email" className="form-control" required maxLength={150} autoComplete="email" />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="contact-message" className="form-label">Message</label>
                            <textarea id="contact-message" name="message" className="form-control" rows="4" required maxLength={2000}></textarea>
                        </div>

                        {error && <div className="alert alert-warning py-2" role="alert">{error}</div>}

                        <button type="submit" className="btn btn-primary w-100" disabled={sending}>
                            {sending ? 'Envoi en cours…' : 'Envoyer'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default Contact;
