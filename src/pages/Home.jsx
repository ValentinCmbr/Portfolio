import { FaGithub, FaLinkedin } from "react-icons/fa";
import ParticleCanvas from '../components/ParticleCanvas';
import RotatingWord from '../components/RotatingWord';

const WORDS = ["Administration Salesforce", "Gestion de projet ERP", "Support applicatif", "Développement web"];
const TECHS = ["Salesforce", "Zendesk", "n8n", "Odoo", "React", "PHP", "Symfony"];
// Pas de CV à jour pour l'instant — déposer public/CV_Dev.pdf puis repasser à true.
const SHOW_CV_BUTTON = false;

const Home = () => {
    return (
        <section
            id="home"
            className="vh-100 d-flex align-items-center pt-5"
            style={{ backgroundColor: 'var(--bg)', position: 'relative', overflow: 'hidden' }}
        >
            <ParticleCanvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />

            <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>

                <span style={{
                    fontSize: '13px',
                    letterSpacing: '0.07em',
                    color: 'var(--skills-label-color)',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '1rem'
                }}>
                    Chargé d'applications métier — Salesforce & ERP
                </span>

                <h1 className="fw-bold">Salut, moi c'est Valentin 👋</h1>

                <div className="d-flex justify-content-center align-items-center gap-2 mt-3" style={{ minHeight: '36px' }}>
                    <RotatingWord words={WORDS} />
                </div>

                <div className="d-flex justify-content-center gap-4 mt-4 fs-3">
                    <a
                        href="https://www.linkedin.com/in/valentin-combier"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        style={{ color: 'var(--text)' }}
                        aria-label="LinkedIn de Valentin Combier"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://github.com/ValentinCmbr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        style={{ color: 'var(--text)' }}
                        aria-label="GitHub de Valentin Combier"
                    >
                        <FaGithub />
                    </a>
                </div>

                <div className="d-flex justify-content-center flex-wrap gap-2 mt-4">
                    {TECHS.map(tech => (
                        <span key={tech} className="theme-tag" style={{
                            fontSize: '12px',
                            padding: '4px 14px',
                            background: 'var(--tag-bg)',
                            color: 'var(--tag-color)',
                            border: '1px solid var(--tag-border)'
                        }}>
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <a href="#projects" className="btn btn-dark px-4">Mes projets</a>
                    <a href="#contact" className="btn btn-outline-dark px-4">Me contacter</a>
                    {SHOW_CV_BUTTON && (
                        <a
                            href="/CV_Dev.pdf"
                            download="CV_Valentin_Combier.pdf"
                            className="btn btn-outline-dark px-4"
                        >
                            Télécharger CV
                        </a>
                    )}
                </div>

            </div>
        </section>
    );
};

export default Home;
