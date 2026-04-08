import React from 'react';
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
        <span style={{ fontSize: '11px', color: '#6c757d', lineHeight: 1.2, textAlign: 'center' }}>{label}</span>
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

const Skills = () => {
    return (
        <section
            id="skills"
            className="py-5 text-center"
            style={{ backgroundColor: '#FEFEFE', borderTop: '1px solid #d6e1f3' }}
        >
            <div className="container">
                <h2 className="fw-bold mb-5">Mes compétences</h2>
                <div className="row justify-content-center">
                    {categories.map(cat => (
                        <div key={cat.title} className="col-md-4 mb-5">
                            <h4 className="text-primary mb-4">{cat.title}</h4>
                            <div className="d-flex flex-wrap justify-content-center gap-3">
                                {cat.skills.map(s => (
                                    <SkillIcon key={s.label} icon={s.icon} label={s.label} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;