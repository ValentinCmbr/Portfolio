import React from 'react';
import { FaReact, FaHtml5, FaCss3Alt, FaJsSquare, FaPhp, FaSymfony, FaGitAlt, FaLinux, FaDatabase } from 'react-icons/fa';
import { SiMysql, SiPostgresql, SiDocker } from 'react-icons/si';

const Skills = () => {
    return (
        <>
            <section id="skills" className="py-5 bg-light text-center">
                <div className="container">
                    <h2 className="fw-bold mb-5">Mes Compétences</h2>

                    <div className="row justify-content-center">

                        {/* Frontend */}
                        <div className="col-md-4 mb-4">
                            <h4 className="text-primary mb-3">Frontend</h4>
                            <div className="d-flex flex-wrap justify-content-center gap-3 fs-2">
                                <FaHtml5 title="HTML5"/>
                                <FaCss3Alt title="CSS3"/>
                                <FaJsSquare title="JavaScript"/>
                                <FaReact title="React"/>
                            </div>
                        </div>

                        {/* Backend */}
                        <div className="col-md-4 mb-4">
                            <h4 className="text-primary mb-3">Backend</h4>
                            <div className="d-flex flex-wrap justify-content-center gap-3 fs-2">
                                <FaPhp title="PHP"/>
                                <FaSymfony title="Symfony"/>
                                <FaDatabase title="SQL"/>
                                <SiMysql title="MySQL"/>
                                <SiPostgresql title="PostgreSQL"/>
                            </div>
                        </div>

                        {/* Outils */}
                        <div className="col-md-4 mb-4">
                            <h4 className="text-primary mb-3">Outils & DevOps</h4>
                            <div className="d-flex flex-wrap justify-content-center gap-3 fs-2">
                                <FaGitAlt title="Git"/>
                                <SiDocker title="Docker"/>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <div style={{overflow: 'hidden', lineHeight: 0, background: '#f8f9fa'}}>
                <svg
                    viewBox="0 0 1440 320"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{display: 'block'}}
                >
                    <path
                        fill="#ffffff" // couleur de fond de Projects
                        fillOpacity="1"
                        d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,144C840,128,960,128,1080,133.3C1200,139,1320,149,1380,154.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    />
                </svg>
            </div>
        </>
    );
};

export default Skills;
