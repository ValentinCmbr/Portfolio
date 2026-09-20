import { useEffect, useState } from 'react';

const TYPE_MS = 75;
const DELETE_MS = 60;
const HOLD_MS = 950;

// Isolated from the hero on purpose: this ticks every ~75ms forever, and
// keeping the state here means React only re-renders this one <span> instead
// of the whole Home section (headings, tags, buttons, canvas) on every letter.
const RotatingWord = ({ words }) => {
    const [{ wordIndex, charIndex, deleting }, setState] = useState({
        wordIndex: 0,
        charIndex: 0,
        deleting: false,
    });

    useEffect(() => {
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
    }, [words, wordIndex, charIndex, deleting]);

    return (
        <p className="lead fw-bold mb-0" style={{
            borderRight: '2px solid var(--text)',
            paddingRight: '3px',
            minWidth: '2ch',
        }}>
            {words[wordIndex].slice(0, charIndex)}
        </p>
    );
};

export default RotatingWord;
