import react from "react";
import '../pages/PositionPaper.css';
import Sidebar from "../components/Sidebar";
import ToggleSwitch from "../components/ToggleSwitch";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import UserContext from "../components/UserContext";
import {send_to_gpt} from "../services/BackendServices";
import ReactMarkdown from 'react-markdown';
import { useRef } from "react";


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

    useEffect(() => {
        if (localStorage.getItem("positionPaper")) {
            const savedPositionPaper = JSON.parse(localStorage.getItem("positionPaper"));
            setPositionPaper(savedPositionPaper);
            setShowPositionPaper(true);
            setShowSetup(false);
            setShowAdjust(true);
        }
    }, []);
    
    async function handleGenerate() {
        setShowSetup(false);
        setLoading(true);
        setShowAdjust(true);
        setShowPositionPaper(false);
        let wordCount = document.getElementById("word-limit").value
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
        prompt += "word limit = " + wordCount
        console.log(prompt);
        let response = await send_to_gpt(prompt);
        response = cleanMarkdown(response);
        setPositionPaper({
            title: "Position Paper" + " - " + Delegation,
            content: response
        });
        localStorage.setItem("positionPaper", JSON.stringify({
            title: "Position Paper" + " - " + Delegation,
            content: response
        }));
        setLoading(false);
        setShowPositionPaper(true);
    }


    const printRef = useRef();

    function handleDownload() {
        
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();

    }

    function cleanMarkdown(markdown) {
      return markdown
        .split('\n')             // Split into lines
        .map(line => line.trimStart()) // Remove leading spaces
        .join('\n')              // Rejoin lines
        .trim();                 // Remove top/bottom blank lines
    }

 


    return (
        <>
        <div className="position-app">
            <Sidebar /> 
            <div className="position-main">
                <div className="position-paper">
                    {loading && <>
                        <img className="un_logo" src={process.env.PUBLIC_URL + "/icons/un.png"}/>
                        <h2 id="delegate_ai">Delegate AI</h2>
                        <p id="pls_wait">Writing. Please wait...</p>
                        <img className="pp-loading" src={process.env.PUBLIC_URL + "/images/loading-animation.gif"} alt="Loading..." />
                    </>}
                    {showSetup && <>
                        <img className="un_logo" src={process.env.PUBLIC_URL + "/icons/un.png"} style={{height:"130px",  width:"150px"}}/>
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
                        
                        <select id="word-limit">
                            <option value="400">400 words (1 page)</option>
                            <option value="600" selected>600 words (1.5 pages)</option>
                            <option value="800">800 words (2 pages)</option>
                        </select>

                        <button className="generate-button" onClick={handleGenerate}>Generate</button>
                        </div>
                    </>}
                    {showPositionPaper && <>
                        <div className="position-paper-content" id="position-paper-content" ref={printRef}>
                            <ReactMarkdown id="position-paper-md">{positionPaper.content}</ReactMarkdown>
                        </div>
                        <div className="download_section">
                            <span className="download_button" onClick={handleDownload}>
                                <a>Download</a>
                                <img className="download_icon" src={process.env.PUBLIC_URL + "/images/download.png"} alt="Download" />
                            </span>
                        </div>
                    </>}
                        

                </div>
                <div className="settings">

                    {showAdjust && <>
                        <h2 id="adjust-title">Adjust:</h2>

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
                        
                        <select id="word-limit">
                            <option value="400">400 words (1 page)</option>
                            <option value="600" selected>600 words (1.5 pages)</option>
                            <option value="800">800 words (2 pages)</option>
                        </select>

                        <span className="regenerate" onClick={handleGenerate}>
                            <a className="regenerate_text">Regenerate</a>
                            <img className="regenerate_img" src={process.env.PUBLIC_URL + "/images/regenerate.png"} alt="Regenerate" />
                        </span>
                    </>}

                </div>
            </div>
        </div>
        </>
    );
}

export default PositionPaper;