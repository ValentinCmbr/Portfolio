import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import useInViewOnce from '../hooks/useInViewOnce';

const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const LS_KEY = 'contact_last_sent';

const readLastSent = () => {
    try { return parseInt(localStorage.getItem(LS_KEY) || '0', 10); } catch { return 0; }
};

const writeLastSent = () => {
    try { localStorage.setItem(LS_KEY, Date.now().toString()); } catch { /* rate limit not persisted */ }
};

const Contact = () => {
    const form = useRef();
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [ref, inView] = useInViewOnce();

    const getCooldownRemaining = () => {
        const remaining = COOLDOWN_MS - (Date.now() - readLastSent());
        return remaining > 0 ? Math.ceil(remaining / 60000) : 0;
    };

    const sendEmail = (e) => {
        e.preventDefault();
        setError(null);

        // Honeypot: a real visitor never sees this field, so anything in it is a bot.
        if (form.current.website.value) return;

        const cooldown = getCooldownRemaining();
        if (cooldown > 0) {
            setError(`Merci de patienter encore ${cooldown} minute(s) avant de renvoyer un message.`);
            return;
        }

        setSending(true);

        emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            form.current,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        )
            .then(() => {
                writeLastSent();
                setSent(true);
            }, () => {
                setError("Une erreur est survenue, veuillez réessayer plus tard.");
            })
            .finally(() => setSending(false));
    };

    return (
        <section id="contact" className="py-5 text-center" style={{backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)'}}>
            <div ref={ref} className={`container reveal${inView ? ' is-visible' : ''}`}>
                <h2 className="fw-bold mb-4">Me contacter</h2>

                {!sent ? (
                    <form ref={form} onSubmit={sendEmail} className="mx-auto" style={{ maxWidth: '600px' }}>
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
                ) : (
                    <div className="alert alert-success" role="status">Message bien envoyé, merci ! ✅</div>
                )}
            </div>
        </section>
    );
};

export default Contact;
