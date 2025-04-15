import React from 'react';
import { FaGraduationCap } from 'react-icons/fa';

const Formations = () => {
    return (
            <section
                id="formations"
                className="pt-5 pb-5"
                style={{backgroundColor: '#FEFEFE', borderTop: '1px solid #d6e1f3'}}
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
    );
};

export default Formations;
