import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import '../styles/Timeline.css';

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

const FormationItem = ({ degree, school, period, details }) => (
    <motion.div className="timeline-item" variants={itemVariants}>
        <div className="timeline-dot"></div>
        <div className="timeline-content">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-1">
                <div>
                    <h5 className="fw-bold mb-0">{degree}</h5>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>{school}</span>
                </div>
                <span className="badge rounded-pill" style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-color)', fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {period}
                </span>
            </div>
            {details && (
                <p className="mb-0 mt-2" style={{ fontSize: '0.875rem', color: 'var(--detail-color)' }}>{details}</p>
            )}
        </div>
    </motion.div>
);

const Formations = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id="formations" className="py-5" style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
            <div className="container">
                <h2 className="text-center fw-bold mb-5">Mes formations</h2>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <motion.div
                            ref={ref}
                            className="timeline"
                            variants={containerVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                        >
                            <FormationItem
                                degree="Master · Manager de solutions digitales et data"
                                school="ORT Lyon"
                                period="2022 – 2024"
                            />

                            <FormationItem
                                degree="Bachelor · Concepteur de Systèmes d'Informations"
                                school="ORT Lyon"
                                period="2021 – 2022"
                            />

                            <FormationItem
                                degree="BTS · Systèmes numériques informatiques et réseaux"
                                school="ORT Lyon"
                                period="2019 – 2021"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Formations;
