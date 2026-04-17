import React, { useEffect, useRef, useState } from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";

const WORDS = ["Front-end", "Full-stack", "React", "Web"];
const TECHS = ["React", "JavaScript", "PHP", "Symfony", "Odoo"];

const Home = () => {
    const [displayed, setDisplayed] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        const word = WORDS[wordIndex];
        let timeout;

        if (!deleting) {
            timeout = setTimeout(() => {
                setDisplayed(word.slice(0, charIndex + 1));
                setCharIndex(i => i + 1);
                if (charIndex + 1 === word.length) {
                    setTimeout(() => setDeleting(true), 950);
                }
            }, 75);
        } else {
            timeout = setTimeout(() => {
                setDisplayed(word.slice(0, charIndex - 1));
                setCharIndex(i => i - 1);
                if (charIndex - 1 === 0) {
                    setDeleting(false);
                    setWordIndex(i => (i + 1) % WORDS.length);
                }
            }, 60);
        }

        return () => clearTimeout(timeout);
    }, [charIndex, deleting, wordIndex]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;
        let particles = [];

        const init = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            particles = Array.from({ length: 40 }, () => ({
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
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,0,0,${p.o})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            animId = requestAnimationFrame(draw);
        };

        init();
        draw();
        window.addEventListener("resize", init);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", init);
        };
    }, []);

    return (
        <section
            id="home"
            className="vh-100 d-flex align-items-center pt-5"
            style={{ backgroundColor: '#FEFEFE', position: 'relative', overflow: 'hidden' }}
        >
            <canvas
                ref={canvasRef}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            />

            <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>

                <span style={{
                    fontSize: '13px',
                    letterSpacing: '0.07em',
                    color: '#6c757d',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '1rem'
                }}>
                    Disponible · CDI / CDD
                </span>

                <h1 className="fw-bold">Salut, moi c'est Valentin 👋</h1>

                <div className="d-flex justify-content-center align-items-center gap-2 mt-3" style={{ minHeight: '36px' }}>
                    <p className="lead text-muted mb-0">Développeur</p>
                    <p className="lead fw-bold mb-0" style={{
                        borderRight: '2px solid #212529',
                        paddingRight: '3px',
                        minWidth: '2ch'
                    }}>
                        {displayed}
                    </p>
                </div>

                <div className="d-flex justify-content-center gap-4 mt-4 fs-3">
                    <a
                        href="https://www.linkedin.com/in/valentin-combier"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-dark"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="https://github.com/ValentinCmbr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-dark"
                    >
                        <FaGithub />
                    </a>
                </div>

                <div className="d-flex justify-content-center flex-wrap gap-2 mt-4">
                    {TECHS.map(tech => (
                        <span key={tech} style={{
                            fontSize: '12px',
                            padding: '4px 14px',
                            borderRadius: '99px',
                            background: '#f1f1f1',
                            color: '#555',
                            border: '1px solid #e0e0e0'
                        }}>
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <a href="#projects" className="btn btn-dark px-4">Mes projets</a>
                    <a href="#contact" className="btn btn-outline-dark px-4">Me contacter</a>
                    <a
                        href="/CV_Dev.pdf"
                        download="CV_Valentin_Combier.pdf"
                        className="btn btn-outline-dark px-4"
                    >
                        Télécharger CV
                    </a>
                </div>

            </div>
        </section>
    );
};

export default Home;