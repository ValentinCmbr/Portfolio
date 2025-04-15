import React from 'react';
import ZenaviaLogo from "../components/ZenaviaLogo";

const Projects = () => {
    return (
        <section
            id="projects"
            className="py-5 text-center"
            style={{ backgroundColor: '#FEFEFE', borderTop: '1px solid #d6e1f3' }}
        >
            <div className="container">
                <h2 className="fw-bold mb-5">Mes Projets</h2>

                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100 shadow-lg border-0">
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex align-items-center justify-content-center mb-3">
                                <ZenaviaLogo width={50} height={50} />
                                </div>
                                <h5 className="card-title d-flex align-items-center justify-content-center gap-2">
                                    Zenavia
                                </h5>
                                <p className="card-text">
                                    Développement d'un site web pour le serveur Minecraft Zenavia
                                </p>
                                <a
                                    href="https://zenavia.net/"
                                    className="mt-auto btn btn-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
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
