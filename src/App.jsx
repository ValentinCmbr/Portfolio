import { useState, useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Experiences from "./pages/Experiences";
import Formations from "./pages/Formations";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import ScrollToTopButton from "./components/ScrollTopButton";
import Loader from "./components/Loader";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
    const [loading, setLoading] = useState(() => document.readyState !== 'complete');

    useEffect(() => {
        if (!loading) return;
        const done = () => setLoading(false);
        window.addEventListener('load', done, { once: true });
        return () => window.removeEventListener('load', done);
    }, [loading]);

    // Sections chargées d'emblée : en lazy, elles ne pesaient que quelques ko et
    // obligeaient à placer le footer dans le même Suspense, donc dans <main>.
    return (
        <ThemeProvider>
            {loading ? (
                <Loader />
            ) : (
                <div className="app-enter">
                    <a href="#main" className="skip-link visually-hidden-focusable">Aller au contenu</a>
                    <Navbar />
                    <main id="main" tabIndex={-1}>
                        <Home />
                        <About />
                        <Skills />
                        <Projects />
                        <Experiences />
                        <Formations />
                        <Contact />
                    </main>
                    <Footer />
                    <ScrollToTopButton />
                </div>
            )}
        </ThemeProvider>
    );
}

export default App;
