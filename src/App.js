import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Formations from "./pages/formations";
import Experiences from "./pages/experiences";
import About from "./pages/about";
import Navbar from "./components/Navbar";
import Contact from "./pages/contact";
import React, {useState, useEffect} from "react";
import Projects from "./pages/projects";
import Skills from "./pages/skills";
import ScrollToTopButton from "./components/ScrollTopButton";
import Loader from "./components/Loader";
import {motion} from "framer-motion";

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500); // durée du loader en ms

        return () => clearTimeout(timer);
    }, []);

    return (
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
                </motion.div>
            )}
        </>
    );
}

export default App;
