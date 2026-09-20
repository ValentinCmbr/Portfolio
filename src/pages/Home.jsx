import { useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useTheme } from '../context/ThemeContext';
import RotatingWord from '../components/RotatingWord';

const WORDS = ["Front-end", "Full-stack", "React", "Web"];
const TECHS = ["React", "JavaScript", "PHP", "Symfony", "Odoo", "Salesforce"];
const PARTICLE_COUNT = 40;
// Pas de CV à jour pour l'instant — repasser à true dès qu'un CV est prêt à publier.
const SHOW_CV_BUTTON = false;

const Home = () => {
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

        // Only run the particle animation while the hero is actually on screen —
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
        <section
            id="home"
            className="vh-100 d-flex align-items-center pt-5"
            style={{ backgroundColor: 'var(--bg)', position: 'relative', overflow: 'hidden' }}
        >
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            />

            <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>

                <span style={{
                    fontSize: '13px',
                    letterSpacing: '0.07em',
                    color: 'var(--skills-label-color)',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '1rem'
                }}>
                    Technicien support applicatif & Administrateur Salesforce
                </span>

                <h1 className="fw-bold">Salut, moi c'est Valentin 👋</h1>

                <div className="d-flex justify-content-center align-items-center gap-2 mt-3" style={{ minHeight: '36px' }}>
                    <p className="lead text-muted mb-0">Développeur</p>
                    <RotatingWord words={WORDS} />
                </div>

                <div className="d-flex justify-content-center gap-4 mt-4 fs-3">
                    <a
                        href="https://www.linkedin.com/in/valentin-combier"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        style={{ color: 'var(--text)' }}
                        aria-label="LinkedIn de Valentin Combier"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://github.com/ValentinCmbr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        style={{ color: 'var(--text)' }}
                        aria-label="GitHub de Valentin Combier"
                    >
                        <FaGithub />
                    </a>
                </div>

                <div className="d-flex justify-content-center flex-wrap gap-2 mt-4">
                    {TECHS.map(tech => (
                        <span key={tech} className="theme-tag" style={{
                            fontSize: '12px',
                            padding: '4px 14px',
                            background: 'var(--tag-bg)',
                            color: 'var(--tag-color)',
                            border: '1px solid var(--tag-border)'
                        }}>
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <a href="#projects" className="btn btn-dark px-4">Mes projets</a>
                    <a href="#contact" className="btn btn-outline-dark px-4">Me contacter</a>
                    {SHOW_CV_BUTTON && (
                        <a
                            href="/CV_Dev.pdf"
                            download="CV_Valentin_Combier.pdf"
                            className="btn btn-outline-dark px-4"
                        >
                            Télécharger CV
                        </a>
                    )}
                </div>

            </div>
        </section>
    );
};

export default Home;
