import { useState, useEffect, lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Navbar from "./components/Navbar";
import ScrollToTopButton from "./components/ScrollTopButton";
import Loader from "./components/Loader";
import { ThemeProvider } from "./context/ThemeContext";

const Experiences = lazy(() => import("./pages/Experiences"));
const Formations = lazy(() => import("./pages/Formations"));
const Contact = lazy(() => import("./pages/Contact"));

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let timeout;
        const handleReady = () => {
            timeout = setTimeout(() => setLoading(false), 500);
        };

        if (document.readyState === 'complete') {
            handleReady();
        } else {
            window.addEventListener('load', handleReady, { once: true });
        }

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('load', handleReady);
        };
    }, []);

    return (
        <ThemeProvider>
            {loading ? (
                <Loader />
            ) : (
                <div className="app-enter">
                    <Navbar />
                    <Home />
                    <About />
                    <Skills />
                    <Projects />
                    <Suspense fallback={null}>
                        <Experiences />
                        <Formations />
                        <Contact />
                    </Suspense>
                    <ScrollToTopButton />
                    <Analytics />
                    <SpeedInsights />
                </div>
            )}
        </ThemeProvider>
    );
}

export default App;
