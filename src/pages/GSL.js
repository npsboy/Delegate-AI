import React from "react";
import '../pages/GSL.css';
import Sidebar from "../components/Sidebar";

function GSL() {
    return (
        <div className="app">
            <Sidebar />
            <div className="container">
                <div className="menu">
                    <div className="timeline">
                        <div className="dot active"></div>
                        <div className="text_container">
                            <span className="text">General Speaker’s List</span>
                        </div>
                    </div>
                    <div className="timeline">
                        <div className="dot"></div>
                        <div className="text_container">
                            <span className="topic_title">Mod Cauc 1:</span>
                            <span className="text">Role of regional cooperation</span>
                        </div>
                    </div>
                    <div className="timeline">
                        <div className="dot"></div>
                        <div className="text_container">
                            <span className="topic_title">Mod Cauc 2:</span>
                            <span className="text">Addressing root causes</span>
                        </div>
                    </div>
                    <div className="timeline">
                        <div className="dot"></div>
                        <div className="text_container">
                            <span className="add">+ Add</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="delegate_ai">Delegate AI</h2>
                    <img src="/icons/un.png" className="un-logo"/>
                    <h2>GSL Speech</h2>
                    <button>Write</button>
                </div>
            </div>
        </div>
    );
}

export default GSL;