import react from "react";
import './PositionPaper.css';
import Sidebar from "./Sidebar";
import loading_gif from './loading-animation.gif';
import ToggleSwitch from "./ToggleSwitch";
import regenerate from "./regenerate.png";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import UserContext from "./UserContext";
import {send_to_gpt} from "./services/BackendServices";
import ReactMarkdown from 'react-markdown';
import download_icon from './download.png';
import html2pdf from "html2pdf.js";


function PositionPaper() {

    const [caseStudies, setCaseStudies] = react.useState(true);
    const [Sources, setSources] = react.useState(false);
    const [Simplify, setSimplify] = react.useState(false);

    const {Delegation, setDelegation, Agenda, setAgenda, Committee, setCommittee} = useContext(UserContext);

    const [showAdjust, setShowAdjust] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPositionPaper, setShowPositionPaper] = useState(false);
    const [showSetup, setShowSetup] = useState(true);

    const [positionPaper, setPositionPaper] = useState({
        title: "",
        content: ""
    });
    
    async function handleGenerate() {
        setShowSetup(false);
        setLoading(true);
        setShowAdjust(true);
        setShowPositionPaper(false);
        let prompt = `Write a position paper for ${Delegation} on the ${Agenda} in the ${Committee} committee. in markdown.`;
        if (caseStudies) {
            prompt += " Include case studies.";
        }
        if (Sources) {
            prompt += " Include sources.";
        }
        if (Simplify) {
            prompt += " Simplify the language.";
        }
        console.log(prompt);
        const response = await send_to_gpt(prompt);
        setPositionPaper({
            title: "Position Paper" + " - " + Delegation,
            content: response
        });
        setLoading(false);
        setShowPositionPaper(true);
        console.log(response);
    }

    function handleDownload() {
        const element = document.getElementById("position-paper-content");
        console.log(element);
        if (!element) {
            alert("Element not found!");
            return;
        }
        html2pdf()
            .from(element)
            .set({
              margin: 0.5,
              filename: 'markdown.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            })
            .save()
            .then(() => alert('Downloaded!'));

    } 


    return (
        <div className="app">
            <Sidebar /> 
            <div className="main">
                <div className="position-paper">
                    {loading && <>
                        <img className="un_logo" src="/icons/un.png"/>
                        <h2 id="delegate_ai">Delegate AI</h2>
                        <p id="pls_wait">Writing. Please wait...</p>
                        <img className="loading" src={loading_gif} alt="Loading..." />
                    </>}
                    {showSetup && <>
                        <img className="un_logo" src="/icons/un.png" style={{height:"130px",  width:"150px"}}/>
                        <h2 id="delegate_ai">Delegate AI</h2>
                        <div className="settings" style={{alignSelf:"center"}}>
                        <span>
                            <label>Case studies:</label>
                            <ToggleSwitch checked={caseStudies} onChange={setCaseStudies}/>
                        </span>

                        <span>
                            <label>Sources:</label>
                            <ToggleSwitch checked={Sources} onChange={setSources}/>
                        </span>

                        <span>
                            <label>Simplify:</label>
                            <ToggleSwitch checked={Simplify} onChange={setSimplify}/>
                        </span>

                        <button className="generate-button" onClick={handleGenerate}>Generate</button>
                        </div>
                    </>}
                    {showPositionPaper && <>
                        <div className="position-paper-content" id="position-paper-content">
                            <ReactMarkdown id="position-paper-md">{positionPaper.content}</ReactMarkdown>
                        </div>
                        <div className="download_section">
                            <span className="download_button" onClick={handleDownload}>
                                <a>Download</a>
                                <img className="download_icon" src={download_icon} alt="Download" />
                            </span>
                        </div>
                    </>}
                        

                </div>
                <div className="settings">

                    {showAdjust && <>
                        <h2>Adjust:</h2>

                        <span>
                            <label>Case studies:</label>
                            <ToggleSwitch checked={caseStudies} onChange={setCaseStudies}/>
                        </span>

                        <span>
                            <label>Sources:</label>
                            <ToggleSwitch checked={Sources} onChange={setSources}/>
                        </span>

                        <span>
                            <label>Simplify:</label>
                            <ToggleSwitch checked={Simplify} onChange={setSimplify}/>
                        </span>

                        <span className="regenerate" onClick={handleGenerate}>
                            <a className="regenerate_text">Regenerate</a>
                            <img className="regenerate_img" src={regenerate} alt="Regenerate" />
                        </span>
                    </>}

                </div>
            </div>
        </div>
    );
}

export default PositionPaper;