import React from "react";

const LearnMore = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>En savoir plus</h1>
            <p style={styles.description}>
                Je m'appelle Valentin, et je suis un développeur passionné par la création d'applications web modernes et dynamiques.
                J'adore coder, concevoir des interfaces élégantes et résoudre des problèmes complexes grâce à des solutions numériques innovantes.
            </p>
            <p style={styles.description}>
                Mon objectif est de fournir des expériences utilisateur intuitives, performantes et esthétiques. N'hésitez pas à découvrir
                mes projets et à me contacter pour collaborer !
            </p>
            <button style={styles.button} onClick={() => window.history.back()}>
                Retour à l'accueil
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
        background: "linear-gradient(to left, #ff7e5f, #feb47b)",
        color: "white",
        textAlign: "center",
        fontFamily: "'Roboto', sans-serif",
        padding: "0 20px",
    },
    title: {
        fontSize: "3rem",
        margin: "0.5em 0",
    },
    description: {
        fontSize: "1.2rem",
        marginBottom: "1em",
        maxWidth: "700px",
        lineHeight: "1.6",
    },
    button: {
        background: "#ffffff",
        color: "#ff7e5f",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "transform 0.2s, background 0.3s",
    },
};

styles.button["&:hover"] = {
    background: "#f0f0f0",
    transform: "scale(1.1)",
};

export default LearnMore;
