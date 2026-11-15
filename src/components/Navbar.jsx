import { useState } from 'react';
import TypewriterText from './TypeWriterText';
import ThemeControls from './ThemeControls';

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg fixed-top shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border)' }}>
            <div className="container">
                {/* Le nom accessible ne doit pas suivre l'animation : sans aria-label,
                    le lien n'a aucun nom puis s'épelle lettre par lettre. */}
                <a className="navbar-brand" href="#home" aria-label="Valentin, retour à l'accueil" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                    <TypewriterText text="Valentin" />
                </a>
                <div className="d-flex align-items-center gap-2 ms-auto">
                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-expanded={open}
                        aria-controls="navbarNav"
                        aria-label="Basculer la navigation"
                        onClick={() => setOpen((o) => !o)}
                        style={{ border: '1px solid var(--border)' }}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div className={`collapse navbar-collapse${open ? ' show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto" onClick={() => setOpen(false)}>
                        <li className="nav-item"><a className="nav-link" href="#home">Accueil</a></li>
                        <li className="nav-item"><a className="nav-link" href="#about">À propos</a></li>
                        <li className="nav-item"><a className="nav-link" href="#skills">Mes compétences</a></li>
                        <li className="nav-item"><a className="nav-link" href="#projects">Projets</a></li>
                        <li className="nav-item"><a className="nav-link" href="#experiences">Expériences</a></li>
                        <li className="nav-item"><a className="nav-link" href="#formations">Formations</a></li>
                        <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
                    </ul>
                </div>
                <ThemeControls />
            </div>
        </nav>
    );
};

export default Navbar;
