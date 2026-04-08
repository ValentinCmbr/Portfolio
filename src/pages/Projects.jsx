import ZenaviaLogo from "../components/ZenaviaLogo";
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
        techs: ["React", "Vite", "Framer Motion"],
        link: { href: "https://github.com/ValentinCmbr/Portfolio", label: "Voir le code", icon: <FaGithub size={14} /> },
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const Projects = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section
            id="projects"
            className="py-5 text-center"
            style={{ backgroundColor: '#FEFEFE', borderTop: '1px solid #d6e1f3' }}
        >
            <div className="container">
                <h2 className="fw-bold mb-5">Mes projets</h2>

                <motion.div
                    ref={ref}
                    className="row justify-content-center"
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    transition={{ staggerChildren: 0.15 }}
                >
                    {projects.map((project) => (
                        <motion.div
                            key={project.title}
                            className="col-md-6 col-lg-4 mb-4"
                            variants={cardVariants}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="card h-100 border-0" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderRadius: '0.75rem' }}>
                                <div className="card-body d-flex flex-column p-4">
                                    <div className="mb-3" style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {project.logo ?? <FaGithub size={42} style={{ color: '#212529' }} />}
                                    </div>
                                    <h5 className="fw-bold mb-2">{project.title}</h5>
                                    <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                        {project.description}
                                    </p>
                                    <div className="d-flex flex-wrap justify-content-center gap-1 mb-4">
                                        {project.techs.map((tech) => (
                                            <span key={tech} style={{
                                                fontSize: '11px',
                                                padding: '3px 10px',
                                                borderRadius: '99px',
                                                background: '#f1f5ff',
                                                color: '#0d6efd',
                                                border: '1px solid #dce8ff',
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
                                        style={{ borderRadius: '0.5rem' }}
                                    >
                                        {project.link.icon}
                                        {project.link.label}
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
