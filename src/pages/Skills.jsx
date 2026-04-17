import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    FaReact, FaHtml5, FaCss3Alt, FaJsSquare,
    FaPhp, FaSymfony, FaGitAlt, FaDatabase
} from 'react-icons/fa';
import { SiMysql, SiPostgresql, SiDocker, SiVercel, SiJetbrains, SiOdoo } from 'react-icons/si';
import {
    BiLogoBootstrap, BiLogoJava, BiLogoNodejs,
    BiLogoPython, BiLogoSpringBoot, BiLogoVuejs
} from "react-icons/bi";

const SkillIcon = ({ icon: Icon, label }) => (
    <div className="d-flex flex-column align-items-center" style={{ width: '64px', gap: '6px' }}>
        <Icon style={{ fontSize: '28px' }} />
        <span style={{ fontSize: '11px', color: 'var(--skills-label-color)', lineHeight: 1.2, textAlign: 'center' }}>{label}</span>
    </div>
);

const categories = [
    {
        title: "Frontend",
        skills: [
            { icon: FaHtml5,         label: "HTML5" },
            { icon: FaCss3Alt,       label: "CSS3" },
            { icon: FaJsSquare,      label: "JavaScript" },
            { icon: FaReact,         label: "React" },
            { icon: BiLogoVuejs,     label: "Vue.js" },
            { icon: BiLogoBootstrap, label: "Bootstrap" },
        ]
    },
    {
        title: "Backend",
        skills: [
            { icon: FaPhp,             label: "PHP" },
            { icon: FaSymfony,         label: "Symfony" },
            { icon: BiLogoJava,        label: "Java" },
            { icon: BiLogoSpringBoot,  label: "Spring Boot" },
            { icon: BiLogoPython,      label: "Python" },
            { icon: BiLogoNodejs,      label: "Node.js" },
            { icon: FaDatabase,        label: "SQL" },
            { icon: SiMysql,           label: "MySQL" },
            { icon: SiPostgresql,      label: "PostgreSQL" },
        ]
    },
    {
        title: "Outils & DevOps",
        skills: [
            { icon: FaGitAlt,    label: "Git" },
            { icon: SiDocker,    label: "Docker" },
            { icon: SiVercel,    label: "Vercel" },
            { icon: SiJetbrains, label: "JetBrains" },
            { icon: SiOdoo,      label: "Odoo" },
        ]
    },
];

const FILTERS = ["Tous", ...categories.map(c => c.title)];

const Skills = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const [active, setActive] = useState("Tous");

    const visible = categories.filter(c => active === "Tous" || c.title === active);

    return (
        <section
            id="skills"
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
                <h2 className="fw-bold mb-4">Mes compétences</h2>

                <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setActive(f)}
                            style={{
                                fontSize: '13px',
                                padding: '6px 18px',
                                borderRadius: '99px',
                                border: '1px solid',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                borderColor: active === f ? '#0d6efd' : 'var(--border)',
                                backgroundColor: active === f ? '#0d6efd' : 'var(--tag-bg)',
                                color: active === f ? '#fff' : 'var(--tag-color)',
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        className="row justify-content-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        {visible.map(cat => (
                            <div key={cat.title} className="col-md-4 mb-5">
                                <h4 className="text-primary mb-4">{cat.title}</h4>
                                <div className="d-flex flex-wrap justify-content-center gap-3">
                                    {cat.skills.map(s => (
                                        <SkillIcon key={s.label} icon={s.icon} label={s.label} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>

            </motion.div>
        </section>
    );
};

export default Skills;
