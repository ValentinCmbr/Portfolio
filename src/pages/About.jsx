import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section
            id="about"
            className="py-5 text-center"
            style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}
        >
            <motion.div
                ref={ref}
                className="container"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <h2 className="fw-bold mb-4">À propos de moi</h2>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <p className="lead">
                            Je m'appelle Valentin, développeur web basé à Lyon. J'ai construit mon expérience
                            en alternance sur des projets concrets — intégration d'ERP, développement d'outils
                            internes, et interfaces web du front au back.
                        </p>
                        <p>
                            Ce qui me motive, c'est de comprendre comment les choses fonctionnent et de les
                            améliorer. Que ce soit en optimisant un processus métier ou en peaufinant une
                            interface, j'aime que le résultat soit utile autant que propre.
                        </p>
                        <p>
                            Aujourd'hui je cherche un poste en <strong>CDI / CDD</strong> où je peux continuer
                            à progresser sur des projets qui ont du sens, dans une équipe où la qualité du code
                            et la collaboration comptent vraiment.
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default About;