import React from 'react';

const About = () => {
    return (
        <>
        <section id="about" className="py-5 bg-white text-center">
            <div className="container">
                <h2 className="fw-bold mb-4">À propos de moi</h2>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <p className="lead">
                            Je m'appelle Valentin, développeur passionné par la création de solutions modernes,
                            performantes et accessibles.
                            J’aime transformer des idées en projets concrets, que ce soit une application web, un outil
                            interne ou un site vitrine.
                        </p>
                        <p>
                            Curieux de nature, j’ai toujours aimé comprendre comment les choses fonctionnent, et le
                            développement m’a donné ce terrain de jeu parfait où je peux apprendre sans cesse tout en
                            bâtissant du concret.
                        </p>
                        <p>
                            Que ce soit en entreprise ou en projet perso, j’accorde beaucoup d’importance à la qualité
                            du code, à l’expérience utilisateur, et au travail en équipe.
                            Je suis convaincu que la tech est avant tout un <strong>moyen d’innover, de simplifier et de
                            connecter</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    <div style={{overflow: 'hidden', lineHeight: 0}}>
        <svg viewBox="0 0 1440 150" xmlns="http://www.w3.org/2000/svg">
            <path
                fill="#f8f9fa" // doit correspondre à la couleur de fond de <Skills />
                d="M0,0 C480,120 960,0 1440,120 L1440,150 L0,150 Z"
            />
        </svg>
    </div>
</>
    );
};

export default About;
