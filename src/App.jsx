import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import {useState, useEffect, lazy, Suspense} from "react";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import ScrollToTopButton from "./components/ScrollTopButton";
import Loader from "./components/Loader";
import {motion} from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ThemeProvider } from "./context/ThemeContext";

const Experiences = lazy(() => import("./pages/Experiences"));
const Formations = lazy(() => import("./pages/Formations"));
const Contact = lazy(() => import("./pages/Contact"));

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleReady = () => {
            setTimeout(() => setLoading(false), 500);
        };

        if (document.readyState === 'complete') {
            handleReady();
        } else {
            window.addEventListener('load', handleReady);
            return () => window.removeEventListener('load', handleReady);
        }
    }, []);

    return (
        <ThemeProvider>
        <>
            {loading ? (
                <Loader />
            ) : (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, ease: 'easeOut'}}
                >
                    <Navbar/>
                    <Home/>
                    <About/>
                    <Skills/>
                    <Projects/>
                    <Suspense fallback={null}>
                        <Experiences/>
                        <Formations/>
                        <Contact/>
                    </Suspense>
                    <ScrollToTopButton/>
                    <Analytics />
                    <SpeedInsights />
                </motion.div>
            )}
        </>
        </ThemeProvider>
    );
}

export default App;
