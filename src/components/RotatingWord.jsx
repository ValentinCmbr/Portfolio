import { useEffect, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';

const TYPE_MS = 75;
const DELETE_MS = 60;
const HOLD_MS = 950;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Isolated from the hero on purpose: this ticks every ~75ms forever, and
// keeping the state here means React only re-renders this one <span> instead
// of the whole Home section (headings, tags, buttons, canvas) on every letter.
//
// Une animation qui tourne sans fin doit pouvoir être mise en pause (WCAG
// 2.2.2) : bouton dédié, et pause d'office si le visiteur a demandé moins de
// mouvement.
const RotatingWord = ({ words }) => {
    const [paused, setPaused] = useState(reduceMotion);
    const [{ wordIndex, charIndex, deleting }, setState] = useState({
        wordIndex: 0,
        charIndex: 0,
        deleting: false,
    });

    useEffect(() => {
        if (paused) return;
        const word = words[wordIndex];

        if (!deleting && charIndex === word.length) {
            const timeout = setTimeout(
                () => setState(s => ({ ...s, deleting: true })),
                HOLD_MS
            );
            return () => clearTimeout(timeout);
        }

        const timeout = setTimeout(() => {
            setState(s => {
                if (s.deleting) {
                    return s.charIndex - 1 === 0
                        ? { wordIndex: (s.wordIndex + 1) % words.length, charIndex: 0, deleting: false }
                        : { ...s, charIndex: s.charIndex - 1 };
                }
                return { ...s, charIndex: s.charIndex + 1 };
            });
        }, deleting ? DELETE_MS : TYPE_MS);

        return () => clearTimeout(timeout);
    }, [words, wordIndex, charIndex, deleting, paused]);

    // En pause, le mot affiché en entier plutôt qu'à moitié tapé.
    const shown = paused ? words[wordIndex] : words[wordIndex].slice(0, charIndex);

    return (
        <>
            {/* Lecteurs d'écran : la liste complète, une fois, plutôt qu'un mot
                qui change toutes les 75 ms. */}
            <p className="visually-hidden">{words.join(', ')}</p>
            <p aria-hidden="true" className="lead fw-bold mb-0" style={{
                borderRight: '2px solid var(--text)',
                paddingRight: '3px',
                minWidth: '2ch',
            }}>
                {shown}
            </p>
            <button
                type="button"
                className="theme-pill"
                onClick={() => setPaused(p => !p)}
                aria-label={paused ? "Relancer l'animation" : "Mettre l'animation en pause"}
                style={{
                    border: '1px solid var(--border)',
                    background: 'var(--tag-bg)',
                    color: 'var(--text)',
                    minWidth: '28px',
                    minHeight: '28px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                {paused ? <FaPlay size={10} aria-hidden="true" /> : <FaPause size={10} aria-hidden="true" />}
            </button>
        </>
    );
};

export default RotatingWord;
