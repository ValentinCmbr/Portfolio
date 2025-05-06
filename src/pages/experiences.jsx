import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Timeline.css';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
};

const TimelineItem = ({ title, company, type, date, align = "left" }) => (
    <motion.div
        className={`timeline-item ${align}`}
        variants={itemVariants}
    >
        <div className="timeline-dot"></div>
        <div className="timeline-content shadow-sm">
            <h5 className="fw-bold">{title}</h5>
            <h6 className="text-muted">{company} · {type}</h6>
            <p className="text-muted">{date}</p>
        </div>
    </motion.div>
);

const Experiences = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2
    });

    return (
        <section id="experiences" className="py-5" style={{ backgroundColor: '#FEFEFE', borderTop: '1px solid #d6e1f3' }}>
            <div className="container">
                <h2 className="text-center mb-5 fw-bold">Mon parcours</h2>

                <motion.div
                    ref={ref}
                    className="timeline"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    <TimelineItem
                        title="Consultant en informatique"
                        company="HARA Consulting"
                        type="CDI"
                        date="janv. 2025 – janv. 2025"
                        align="left"
                    />

                    <TimelineItem
                        title="Chargé de projet ERP & SI"
                        company="JOUFFRE"
                        type="Alternance"
                        date="août 2022 – sept. 2024"
                        align="right"
                    />

                    <TimelineItem
                        title="Développeur"
                        company="Akuiteo SAS"
                        type="Stage"
                        date="mars 2022 – juin 2022"
                        align="left"
                    />

                    <TimelineItem
                        title="Développeur"
                        company="IGESIS"
                        type="Alternance"
                        date="oct. 2021 – févr. 2022"
                        align="right"
                    />

                    <TimelineItem
                        title="Agent de support technique"
                        company="Akuiteo SAS"
                        type="Stage"
                        date="mai 2020 – juil. 2020"
                        align="left"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default Experiences;
