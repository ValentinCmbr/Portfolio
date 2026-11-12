import { useState, useEffect } from 'react';

// Lu une fois, comme le canvas de Home : changer le réglage en cours de visite
// est rare, et l'animation ne dure qu'une seconde.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const TypewriterText = ({ text, speed = 120 }) => {
    const [count, setCount] = useState(reduceMotion ? text.length : 0);

    useEffect(() => {
        if (count >= text.length) return;
        const timeout = setTimeout(() => setCount(c => c + 1), speed);
        return () => clearTimeout(timeout);
    }, [count, text, speed]);

    // aria-hidden : le parent porte le nom accessible, sinon un lecteur d'écran
    // lirait le texte à moitié tapé.
    return (
        <span aria-hidden="true" style={{ whiteSpace: 'nowrap' }}>
            {text.slice(0, count)}
        </span>
    );
};

export default TypewriterText;
