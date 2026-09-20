import { useRef, useState } from 'react';
import useInViewOnce from '../hooks/useInViewOnce';

const ENDPOINT = '/api/contact';
const FALLBACK_EMAIL = 'contact@valentincombier.com';

const Contact = () => {
    const form = useRef();
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    // Pendant une bascule vers Vercel, l'endpoint n'existe pas : on bascule sur
    // l'adresse en clair plutôt que d'afficher une erreur sans issue.
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

            if (res.status === 404) {
                setUnavailable(true);
                return;
            }

            const payload = await res.json().catch(() => ({}));

            if (res.ok) {
                setSent(true);
            } else {
                setError(payload.error || 'Une erreur est survenue, veuillez réessayer plus tard.');
            }
        } catch {
            // Échec réseau : l'origine est injoignable, même issue qu'un 404.
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
