import Home from "./pages/Home";
import Formations from "./pages/Formations";
import Experiences from "./pages/Experiences";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import {useState, useEffect} from "react";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import ScrollToTopButton from "./components/ScrollTopButton";
import Loader from "./components/Loader";
import {motion} from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ThemeProvider } from "./context/ThemeContext";

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
                    <Experiences/>
                    <Formations/>
                    <Contact/>
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
