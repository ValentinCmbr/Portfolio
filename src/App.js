import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Formations from "./pages/formations";
import Experiences from "./pages/experiences";
import About from "./pages/about";
import Navbar from "./components/Navbar";
import Contact from "./pages/contact";
import React from "react";
import Projects from "./pages/projects";
import Skills from "./pages/skills";

function App() {
    return (
        <>
            <Navbar />
            <Home />
            <About />
            <Skills/>
            <Projects/>
            <Experiences />
            <Formations />
            <Contact/>
        </>
    );
}

export default App;
