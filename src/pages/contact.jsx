import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const form = useRef();
    const [sent, setSent] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm(
            'service_gmail_val',
            'template_cyst4yr',
            form.current,
            'REMOVED',
        )
            .then(() => {
                setSent(true);
            }, (error) => {
                alert("Erreur : " + error.text);
            });
    };

    return (
        <section id="contact" className="py-5 text-center" style={{backgroundColor: '#FEFEFE', borderTop: '1px solid #d6e1f3'}}>
            <div className="container">
                <h2 className="fw-bold mb-4">Me Contacter</h2>

                {!sent ? (
                    <form ref={form} onSubmit={sendEmail} className="mx-auto" style={{ maxWidth: '600px' }}>
                        <div className="mb-3 text-start">
                            <label className="form-label">Nom</label>
                            <input type="text" name="name" className="form-control" required />
                        </div>
                        <div className="mb-3 text-start">
                            <label className="form-label">Email</label>
                            <input type="email" name="email" className="form-control" required />
                        </div>
                        <div className="mb-3 text-start">
                            <label className="form-label">Message</label>
                            <textarea name="message" className="form-control" rows="4" required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Envoyer</button>
                    </form>
                ) : (
                    <div className="alert alert-success">Message bien envoyé, merci ! ✅</div>
                )}
            </div>
        </section>
    );
};

export default Contact;
