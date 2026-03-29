import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text, speed = 120 }) => {
    const [displayed, setDisplayed] = useState('');
    const [i, setI] = useState(0);

    useEffect(() => {
        if (i < text.length) {
            const timeout = setTimeout(() => {
                setDisplayed(prev => prev + text.charAt(i));
                setI(i + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [i, text, speed]);

    return (
        <span style={{ whiteSpace: 'nowrap' }}>
            {displayed}
        </span>
    );
};

export default TypewriterText;
