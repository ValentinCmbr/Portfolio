import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import ZenaviaLogo from "../components/ZenaviaLogo";
import useInViewOnce from '../hooks/useInViewOnce';

const projects = [
    {
        logo: <ZenaviaLogo width={48} height={48} />,
        title: "Zenavia",
        description: "Site web pour le serveur Minecraft Zenavia — gestion de la boutique, classements et actualités.",
        techs: ["PHP", "Symfony", "Bootstrap"],
        link: { href: "https://zenavia.net/", label: "Voir le site", icon: <FaExternalLinkAlt size={12} /> },
    },
    {
        logo: null,
        title: "Portfolio",
        description: "Mon portfolio personnel — conçu et développé de A à Z pour présenter mon parcours.",
        techs: ["React", "Vite", "Bootstrap"],
        link: { href: "https://github.com/ValentinCmbr/Portfolio", label: "Voir le code", icon: <FaGithub size={14} /> },
    },
];

const Projects = () => {
    const [ref, inView] = useInViewOnce();

    return (
        <section
            id="projects"
            className="py-5 text-center"
            style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}
        >
            <div className="container">
                <h2 className="fw-bold mb-5">Mes projets</h2>

                <div
                    ref={ref}
                    className={`row justify-content-center${inView ? ' is-visible' : ''}`}
                >
                    {projects.map((project, index) => (
                        <div
                            key={project.title}
                            className="col-md-6 col-lg-4 mb-4 reveal-item"
                            style={{ '--stagger-index': index }}
                        >
                            <div className="card h-100 border-0 theme-card" style={{ backgroundColor: 'var(--card-bg)' }}>
                                <div className="card-body d-flex flex-column p-4">
                                    <div className="mb-3" style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {project.logo ?? <FaGithub size={42} style={{ color: 'var(--text)' }} />}
                                    </div>
                                    <h5 className="fw-bold mb-2">{project.title}</h5>
                                    <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                        {project.description}
                                    </p>
                                    <div className="d-flex flex-wrap justify-content-center gap-1 mb-4">
                                        {project.techs.map((tech) => (
                                            <span key={tech} className="theme-tag" style={{
                                                fontSize: '11px',
                                                padding: '3px 10px',
                                                background: 'var(--proj-tag-bg)',
                                                color: 'var(--proj-tag-color)',
                                                border: '1px solid var(--proj-tag-border)',
                                            }}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <a
                                        href={project.link.href}
                                        className="mt-auto btn btn-outline-dark d-flex align-items-center justify-content-center gap-2"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {project.link.icon}
                                        {project.link.label}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
