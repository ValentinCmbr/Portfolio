import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme, STYLES } from '../context/ThemeContext';

// Choix du style visuel et du thème clair/sombre, partagé par la navbar du
// portfolio et la page /pdf/.
const ThemeControls = () => {
    const { dark, toggle, style, setStyle } = useTheme();

    return (
        <div className="d-flex align-items-center gap-2">
            <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="theme-pill"
                style={{
                    border: '1px solid var(--border)',
                    padding: '5px 10px',
                    fontSize: '12px',
                    color: 'var(--text)',
                    backgroundColor: 'var(--tag-bg)',
                    cursor: 'pointer',
                }}
                aria-label="Choisir un style visuel"
            >
                {STYLES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                ))}
            </select>
            <button
                onClick={toggle}
                className="btn btn-sm theme-pill"
                style={{
                    border: '1px solid var(--border)',
                    padding: '5px 10px',
                    color: 'var(--text)',
                    backgroundColor: 'var(--tag-bg)',
                }}
                aria-label="Thème sombre"
                aria-pressed={dark}
            >
                {dark ? <FaSun size={14} /> : <FaMoon size={14} />}
            </button>
        </div>
    );
};

export default ThemeControls;
