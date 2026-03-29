import React from 'react';
import {
    FaReact,
    FaHtml5,
    FaCss3Alt,
    FaJsSquare,
    FaPhp,
    FaSymfony,
    FaGitAlt,
    FaDatabase
} from 'react-icons/fa';
import {SiMysql, SiPostgresql, SiDocker, SiVercel, SiJetbrains} from 'react-icons/si';
import {BiLogoBootstrap, BiLogoJava, BiLogoNodejs, BiLogoPython, BiLogoSpringBoot, BiLogoVuejs} from "react-icons/bi";

const Skills = () => {
    return (
        <section
            id="skills"
            className="py-5 text-center"
            style={{ backgroundColor: '#FEFEFE', borderTop: '1px solid #d6e1f3' }}
        >
            <div className="container">
                <h2 className="fw-bold mb-5">Mes Compétences</h2>

                <div className="row justify-content-center">
                    {/* Frontend */}
                    <div className="col-md-4 mb-4">
                        <h4 className="text-primary mb-3">Frontend</h4>
                        <div className="d-flex flex-wrap justify-content-center gap-3 fs-2">
                            <FaHtml5 title="HTML5" />
                            <FaCss3Alt title="CSS3" />
                            <FaJsSquare title="JavaScript" />
                            <FaReact title="React" />
                            <BiLogoVuejs title="Vue.js" />
                            <BiLogoBootstrap title="Bootstrap" />
                        </div>
                    </div>

                    {/* Backend */}
                    <div className="col-md-4 mb-4">
                        <h4 className="text-primary mb-3">Backend</h4>
                        <div className="d-flex flex-wrap justify-content-center gap-3 fs-2">
                            <FaPhp title="PHP" />
                            <FaSymfony title="Symfony" />
                            <BiLogoJava title="Java" />
                            <BiLogoSpringBoot title="Spring Boot" />
                            <BiLogoPython title="Python" />
                            <BiLogoNodejs title="Node.js" />
                            <FaDatabase title="SQL" />
                            <SiMysql title="MySQL" />
                            <SiPostgresql title="PostgreSQL" />
                        </div>
                    </div>

                    {/* Outils */}
                    <div className="col-md-4 mb-4">
                        <h4 className="text-primary mb-3">Outils & DevOps</h4>
                        <div className="d-flex flex-wrap justify-content-center gap-3 fs-2">
                            <FaGitAlt title="Git" />
                            <SiDocker title="Docker" />
                            <SiVercel title="Vercel" />
                            <SiJetbrains title="JetBrains" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
