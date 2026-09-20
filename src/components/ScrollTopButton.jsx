import { useState, useEffect } from 'react';

const SHOW_AFTER_PX = 300;

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > SHOW_AFTER_PX);
        };

        // passive: the handler never calls preventDefault, and saying so lets
        // the browser keep scrolling on the compositor instead of waiting on JS.
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`scroll-top${isVisible ? ' is-visible' : ''}`}
            aria-label="Remonter en haut"
            aria-hidden={!isVisible}
            tabIndex={isVisible ? 0 : -1}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
        </button>
    );
};

export default ScrollToTopButton;
