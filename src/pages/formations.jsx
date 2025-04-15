import React from 'react';
import { FaGraduationCap } from 'react-icons/fa';

const Formations = () => {
    return (
        <>
            <div style={{overflow: 'hidden', lineHeight: 0, background: '#f8f9fa'}}>
                <svg
                    viewBox="0 0 1440 320"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{display: 'block'}}
                >
                    <path
                        fill="#fdfdfd"
                        fillOpacity="1"
                        d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,144C840,128,960,128,1080,133.3C1200,139,1320,149,1380,154.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    />
                </svg>
            </div>
            <section
                id="formations"
                className="pt-5 pb-5"
                style={{backgroundColor: '#fdfdfd'}}
            >
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">Mes Formations</h2>

                    <div
                        className="list-group list-group-flush text-start mx-auto"
                        style={{maxWidth: '600px'}}
                    >
                        <div className="list-group-item bg-transparent border-0 d-flex align-items-center gap-2">
                            <FaGraduationCap className="text-primary"/>
                            <span className="fw-medium">Master Digital Solutions & Data Management - 2024</span>
                        </div>

                        <div className="list-group-item bg-transparent border-top d-flex align-items-center gap-2">
                            <FaGraduationCap className="text-primary"/>
                            <span className="fw-medium">Licence Informatique - 2022</span>
                        </div>

                        <div className="list-group-item bg-transparent border-top d-flex align-items-center gap-2">
                            <FaGraduationCap className="text-primary"/>
                            <span className="fw-medium">BTS SIO - 2020</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Formations;
