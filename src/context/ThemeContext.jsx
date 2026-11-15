import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const STYLES = [
    { id: 'default', label: 'Défaut' },
    { id: 'gradient', label: 'Aurora' },
    { id: 'brutal', label: 'Brutal' },
];

// Safari private mode and "block all cookies" make localStorage throw on
// access; a portfolio should degrade to an unremembered theme, not white-screen.
const storage = {
    get(key) {
        try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
        try { localStorage.setItem(key, value); } catch { /* preference not persisted */ }
    },
};

// Each non-default style pulls its own webfonts on demand instead of every
// visitor downloading all five families up front for a style they may never pick.
const STYLE_FONTS = {
    gradient: 'https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Manrope:wght@400;500;600&display=swap',
    brutal: 'https://fonts.googleapis.com/css2?family=Archivo:wght@500;800;900&family=Space+Mono:wght@400;700&family=Work+Sans:wght@400;500&display=swap',
};

const FONT_ORIGINS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

// Warming the Google Fonts origins belongs here rather than in index.html:
// the default style uses system fonts, so most visits never touch them at all.
const preconnectFontOrigins = () => {
    for (const href of FONT_ORIGINS) {
        if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) continue;
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        link.crossOrigin = '';
        document.head.appendChild(link);
    }
};

const loadStyleFonts = (styleId) => {
    const href = STYLE_FONTS[styleId];
    if (!href || document.getElementById(`font-${styleId}`)) return;
    preconnectFontOrigins();
    const link = document.createElement('link');
    link.id = `font-${styleId}`;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
};

export const ThemeProvider = ({ children }) => {
    // Sombre par défaut. Le thème n'est mémorisé que si le visiteur clique sur
    // le bouton, sous une clé neuve : l'ancienne clé « theme » valait « light »
    // chez tous ceux qui étaient déjà venus, sans qu'ils l'aient choisi.
    const [dark, setDark] = useState(() => storage.get('themeChoisi') !== 'light');
    const choisi = useRef(false);
    const [style, setStyle] = useState(() => {
        const saved = storage.get('siteStyle');
        return STYLES.some(s => s.id === saved) ? saved : 'default';
    });

    useEffect(() => {
        const value = dark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', value);
        document.documentElement.setAttribute('data-bs-theme', value);
        if (choisi.current) storage.set('themeChoisi', value);
    }, [dark]);

    useEffect(() => {
        document.documentElement.setAttribute('data-style', style);
        storage.set('siteStyle', style);
        loadStyleFonts(style);
    }, [style]);

    // L'enregistrement se fait dans l'effet, pas dans la fonction passée à
    // setDark, que React peut appeler deux fois.
    const toggle = useCallback(() => {
        choisi.current = true;
        setDark(d => !d);
    }, []);

    // Without this the provider hands down a fresh object every render, which
    // would re-render every consumer (Navbar, Home) on any parent update.
    const value = useMemo(() => ({ dark, toggle, style, setStyle }), [dark, toggle, style]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
