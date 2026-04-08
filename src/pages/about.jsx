import React from 'react';

const About = () => {
    return (
        <section
            id="about"
            className="py-5 text-center"
            style={{ backgroundColor: '#FEFEFE', borderTop: '1px solid #d6e1f3' }}
        >
            <div className="container">
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
            </div>
        </section>
    );
};

export default About;