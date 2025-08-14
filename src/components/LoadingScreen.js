import React from "react";
import './LoadingScreen.css';

function LoadingScreen() {
return (
    <div className="loading">
        <img
            src={process.env.PUBLIC_URL + "/icons/un.png"}
            className="allies-un-logo"
            alt="UN Logo"
        />
        <h1>Delegate AI</h1>
        <p>Loading Allies and Rivals...</p>
        <img
            src={process.env.PUBLIC_URL + "/images/loading-animation.gif"}
            className="loading-gif"
            alt="Loading..."
        />
    </div>
);
}

export default LoadingScreen;
