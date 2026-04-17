import TypewriterText from './TypeWriterText';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { dark, toggle } = useTheme();

    return (
        <nav className="navbar navbar-expand-lg fixed-top shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border)' }}>
            <div className="container">
                <a className="navbar-brand" href="#home">
                    <TypewriterText text="Valentin" />
                </a>
                <div className="d-flex align-items-center gap-2 ms-auto">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        style={{ border: '1px solid var(--border)' }}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><a className="nav-link" href="#home">Accueil</a></li>
                        <li className="nav-item"><a className="nav-link" href="#about">À propos</a></li>
                        <li className="nav-item"><a className="nav-link" href="#skills">Mes compétences</a></li>
                        <li className="nav-item"><a className="nav-link" href="#projects">Projets</a></li>
                        <li className="nav-item"><a className="nav-link" href="#experiences">Expériences</a></li>
                        <li className="nav-item"><a className="nav-link" href="#formations">Formations</a></li>
                        <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
                    </ul>
                </div>
                <button
                        onClick={toggle}
                        className="btn btn-sm"
                        style={{
                            border: '1px solid var(--border)',
                            borderRadius: '99px',
                            padding: '5px 10px',
                            color: 'var(--text)',
                            backgroundColor: 'var(--tag-bg)',
                        }}
                        aria-label="Basculer le thème"
                    >
                        {dark ? <FaSun size={14} /> : <FaMoon size={14} />}
                    </button>
            </div>
        </nav>
    );
};

export default Navbar;
