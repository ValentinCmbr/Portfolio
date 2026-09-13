import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const STYLES = [
    { id: 'default', label: 'Défaut' },
    { id: 'gradient', label: 'Aurora' },
    { id: 'brutal', label: 'Brutal' },
];

// Each non-default style pulls its own webfonts on demand instead of every
// visitor downloading all five families up front for a style they may never pick.
const STYLE_FONTS = {
    gradient: 'https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Manrope:wght@400;500;600&display=swap',
    brutal: 'https://fonts.googleapis.com/css2?family=Archivo:wght@500;800;900&family=Space+Mono:wght@400;700&family=Work+Sans:wght@400;500&display=swap',
};

const loadStyleFonts = (styleId) => {
    const href = STYLE_FONTS[styleId];
    if (!href || document.getElementById(`font-${styleId}`)) return;
    const link = document.createElement('link');
    link.id = `font-${styleId}`;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
};

export const ThemeProvider = ({ children }) => {
    const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
    const [style, setStyle] = useState(() => {
        const saved = localStorage.getItem('siteStyle');
        return STYLES.some(s => s.id === saved) ? saved : 'default';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    useEffect(() => {
        document.documentElement.setAttribute('data-style', style);
        localStorage.setItem('siteStyle', style);
        loadStyleFonts(style);
    }, [style]);

    return (
        <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d), style, setStyle }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
