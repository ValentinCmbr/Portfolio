import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Timeline.css';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

const TimelineItem = ({ title, company, type, date, description = [] }) => (
    <motion.div className="timeline-item" variants={itemVariants}>
        <div className="timeline-dot"></div>
        <div className="timeline-content">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-1">
                <div>
                    <h5 className="fw-bold mb-0">{title}</h5>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>{company}</span>
                </div>
                <span className="badge rounded-pill" style={{ backgroundColor: '#e8eef8', color: '#0d6efd', fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {type}
                </span>
            </div>
            <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.82rem' }}>{date}</p>
            {description.length > 0 && (
                <ul className="mt-2 mb-0 ps-3" style={{ fontSize: '0.875rem', color: '#444' }}>
                    {description.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            )}
        </div>
    </motion.div>
);

const Experiences = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id="experiences" className="py-5" style={{ backgroundColor: '#FEFEFE', borderTop: '1px solid #d6e1f3' }}>
            <div className="container">
                <h2 className="text-center mb-5 fw-bold">Mon parcours</h2>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <motion.div
                            ref={ref}
                            className="timeline"
                            variants={containerVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                        >

                            <TimelineItem
                                title="Chargé de projet ERP & SI"
                                company="JOUFFRE · Villeurbanne"
                                type="Alternance"
                                date="août 2022 – sept. 2024"
                                description={[
                                    "Déploiement de l'ERP Odoo et accompagnement des équipes utilisateurs",
                                    "Support informatique (postes de travail, réseau, bureautique) et gestion du parc",
                                    "Rédaction de procédures et documentation technique",
                                ]}
                            />

                            <TimelineItem
                                title="Développeur"
                                company="Akuiteo SAS · Lyon"
                                type="Stage"
                                date="mars 2022 – juin 2022"
                                description={[
                                    "Développement de scripts et d'outils de gestion en Java et JavaScript",
                                    "Support informatique et ticketing",
                                ]}
                            />

                            <TimelineItem
                                title="Développeur"
                                company="IGESIS · Lyon"
                                type="Alternance"
                                date="oct. 2021 – févr. 2022"
                                description={[
                                    "Réalisation d'une amélioration de l'application web (JavaScript)",
                                ]}
                            />

                            <TimelineItem
                                title="Agent de support technique"
                                company="Akuiteo SAS · Lyon"
                                type="Stage"
                                date="mai 2020 – juil. 2020"
                                description={[
                                    "Catégorisation, qualification et réponse à des tickets clients",
                                ]}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experiences;
