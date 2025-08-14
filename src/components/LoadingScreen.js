import React from "react";
import './LoadingScreen.css';

function LoadingScreen({ label }) {
return (
    <div className="loading">
        <img
            src={process.env.PUBLIC_URL + "/icons/un.png"}
            className="loading-un-logo"
            alt="UN Logo"
        />
        <h1>Delegate <span className="highlight">AI</span></h1>
        <p>{label}</p>
        <img
            src={process.env.PUBLIC_URL + "/images/loading-animation.gif"}
            className="loading-gif"
            alt="Loading..."
        />
    </div>
);
}

export default LoadingScreen;
