import React from "react";
import './GSL.css';
import Sidebar from "./Sidebar";

function GSL() {
    return (
        <div className="app">
            <Sidebar />
            <div className="container">
                <div className="sidebar">
                    <div className="timeline">
                        <div className="dot active"></div>
                        <span className="text">General Speaker’s List</span>
                    </div>
                    <div className="timeline">
                        <div className="dot"></div>
                        <span className="text">+ Moderated Caucus</span>
                    </div>
                </div>

                <div className="card">
                </div>
            </div>
        </div>
    );
}

export default GSL;