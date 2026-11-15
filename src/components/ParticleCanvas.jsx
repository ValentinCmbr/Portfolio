import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const PARTICLE_COUNT = 40;

// Particules de fond, partagées par le haut de l'accueil et la page /pdf/.
// Le style (position, taille) est donné par la page qui l'utilise.
const ParticleCanvas = ({ style }) => {
    const canvasRef = useRef(null);
    const { dark } = useTheme();
    // The rAF loop reads the theme through a ref, so the canvas effect can stay
    // mount-only instead of tearing down and reallocating on every toggle.
    const darkRef = useRef(dark);
    useEffect(() => { darkRef.current = dark; }, [dark]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Respect the OS "reduce motion" setting: no canvas work at all for
        // visitors who asked not to see decorative animation.
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reduceMotion.matches) return;

        const ctx = canvas.getContext("2d");
        let animId = null;
        let resizeId = null;
        let particles = [];

        const init = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            particles = Array.from({ length: PARTICLE_COUNT }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.8 + 0.4,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                o: Math.random() * 0.2 + 0.05,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Hoisted out of the loop: the rgb triplet is identical for every
            // particle, so building it once per frame beats once per particle.
            const rgb = darkRef.current ? '255,255,255' : '0,0,0';
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb},${p.o})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            }
            animId = requestAnimationFrame(draw);
        };

        const start = () => {
            if (animId === null) draw();
        };
        const stop = () => {
            if (animId !== null) {
                cancelAnimationFrame(animId);
                animId = null;
            }
        };

        // Resize fires in bursts while dragging a window edge; reallocating
        // every particle on each event is pure waste, so coalesce to one frame.
        const onResize = () => {
            cancelAnimationFrame(resizeId);
            resizeId = requestAnimationFrame(init);
        };

        init();
        window.addEventListener("resize", onResize);

        // Only run the particle animation while the canvas is actually on screen —
        // no point burning CPU/battery drawing a section the user has scrolled past.
        const observer = new IntersectionObserver(
            ([entry]) => (entry.isIntersecting ? start() : stop()),
            { threshold: 0 }
        );
        observer.observe(canvas);

        return () => {
            observer.disconnect();
            stop();
            cancelAnimationFrame(resizeId);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{ pointerEvents: 'none', ...style }}
        />
    );
};

export default ParticleCanvas;
