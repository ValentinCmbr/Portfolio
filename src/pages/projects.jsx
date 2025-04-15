import React from 'react';
import ZenaviaLogo from "../components/ZenaviaLogo";

const Projects = () => {
    return (
        <section id="projects" className="py-5 bg-white text-center">
            <div className="container">
                <h2 className="fw-bold mb-5">Mes Projets</h2>

                <div className="row justify-content-center">

                    <div className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title d-flex align-items-center justify-content-center gap-2">
                                    <ZenaviaLogo width={30} height={30}/>
                                    Zenavia
                                </h5>
                                <p className="card-text">
                                    Développement d'un site web pour le serveur Minecraft Zenavia
                                </p>
                                <a href="https://zenavia.net/" className="mt-auto btn btn-primary" target="_blank" rel="noopener noreferrer">
                                    Voir le site web
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Projects;
