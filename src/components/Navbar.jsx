import React from 'react';
import TypewriterText from './TypeWriterText';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
            <div className="container">
                <a className="navbar-brand" href="#home">
                    <TypewriterText text="Valentin" />
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#home">Accueil</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#about">À propos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#skills">Mes compétences</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#projects">Projets</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#experiences">Expériences</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#formations">Formations</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#contact">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
