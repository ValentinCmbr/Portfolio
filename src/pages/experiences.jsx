import React from 'react';
import './Timeline.css';

const TimelineItem = ({ title, company, type, date, align = "left" }) => (
    <div className={`timeline-item ${align}`}>
        <div className="timeline-dot"></div>
        <div className="timeline-content shadow-sm">
            <h5 className="fw-bold">{title}</h5>
            <h6 className="text-muted">{company} · {type}</h6>
            <p className="text-muted">{date}</p>
        </div>
    </div>
);

const Experiences = () => {
    return (
        <>
            <div style={{overflow: 'hidden', lineHeight: 0}}>
                <svg viewBox="0 0 1440 150" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill="#e9f1ff"
                        d="M0,0 C480,120 960,0 1440,120 L1440,150 L0,150 Z"
                    />
                </svg>
            </div>

            <section id="experiences" className="py-5" style={{backgroundColor: '#e9f1ff'}}>
                <div className="container">
                    <h2 className="text-center mb-5 fw-bold">Mon parcours</h2>
                    <div className="timeline">

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
                    </div>
                </div>
            </section>
        </>
    );
};

export default Experiences;
