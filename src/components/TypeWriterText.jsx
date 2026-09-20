import { useState, useEffect } from 'react';

const TypewriterText = ({ text, speed = 120 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (count >= text.length) return;
        const timeout = setTimeout(() => setCount(c => c + 1), speed);
        return () => clearTimeout(timeout);
    }, [count, text, speed]);

    return (
        <span style={{ whiteSpace: 'nowrap' }}>
            {text.slice(0, count)}
        </span>
    );
};

export default TypewriterText;
