import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const LS_KEY = 'contact_last_sent';

const Contact = () => {
    const form = useRef();
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [honeypot, setHoneypot] = useState('');

    const getCooldownRemaining = () => {
        const last = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
        const remaining = COOLDOWN_MS - (Date.now() - last);
        return remaining > 0 ? Math.ceil(remaining / 60000) : 0;
    };

    const sendEmail = (e) => {
        e.preventDefault();
        setError(null);
        if (honeypot) return;
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
                localStorage.setItem(LS_KEY, Date.now().toString());
                setSent(true);
            }, () => {
                setError("Une erreur est survenue, veuillez réessayer plus tard.");
            })
            .finally(() => setSending(false));
    };

    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id="contact" className="py-5 text-center" style={{backgroundColor: '#FEFEFE', borderTop: '1px solid #d6e1f3'}}>
            <motion.div
                ref={ref}
                className="container"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <h2 className="fw-bold mb-4">Me contacter</h2>

                {!sent ? (
                    <form ref={form} onSubmit={sendEmail} className="mx-auto" style={{ maxWidth: '600px' }}>
                        <input
                            type="text"
                            name="website"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                            style={{ display: 'none' }}
                            tabIndex="-1"
                            autoComplete="off"
                        />

                        <div className="mb-3 text-start">
                            <label className="form-label">Nom</label>
                            <input type="text" name="name" className="form-control" required maxLength={100} />
                        </div>
                        <div className="mb-3 text-start">
                            <label className="form-label">Email</label>
                            <input type="email" name="email" className="form-control" required maxLength={150} />
                        </div>
                        <div className="mb-3 text-start">
                            <label className="form-label">Message</label>
                            <textarea name="message" className="form-control" rows="4" required maxLength={2000}></textarea>
                        </div>

                        {error && <div className="alert alert-warning py-2">{error}</div>}

                        <button type="submit" className="btn btn-primary w-100" disabled={sending}>
                            {sending ? 'Envoi en cours…' : 'Envoyer'}
                        </button>
                    </form>
                ) : (
                    <div className="alert alert-success">Message bien envoyé, merci ! ✅</div>
                )}
            </motion.div>
        </section>
    );
};

export default Contact;
