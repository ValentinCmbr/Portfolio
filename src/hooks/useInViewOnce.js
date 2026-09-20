import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element the first time it scrolls into view, then stops observing.
 * Wraps the platform IntersectionObserver directly — the reveal is a CSS class
 * toggle, so there is nothing here a library needs to do for us.
 */
export default function useInViewOnce(threshold = 0.1) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Without IntersectionObserver, show the content rather than leaving it
        // stuck at opacity 0 forever.
        if (typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            setInView(true);
            observer.disconnect();
        }, { threshold });

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView];
}
