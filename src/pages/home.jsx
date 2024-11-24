import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Bienvenue sur mon Portfolio</h1>
            <p style={styles.description}>
                Découvrez mes projets et apprenez-en davantage sur mon parcours.
            </p>
            <button style={styles.button} onClick={() => navigate("/learn-more")}>
                En savoir plus
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "white",
        textAlign: "center",
        fontFamily: "'Roboto', sans-serif",
    },
    title: {
        fontSize: "3rem",
        margin: "0.5em 0",
    },
    description: {
        fontSize: "1.2rem",
        marginBottom: "1.5em",
        maxWidth: "600px",
    },
    button: {
        background: "#ffffff",
        color: "#2575fc",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "transform 0.2s, background 0.3s",
    },
};

export default Home;
