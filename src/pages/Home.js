import React from "react";
import '../pages/Home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../components/UserContext';
import { useContext } from "react";
import { useLocation } from 'react-router-dom';
import { isMobile } from "react-device-detect";


function Home() {
    const location = useLocation();

    const navigate = useNavigate();

    const {Delegation, setDelegation, Agenda, setAgenda, Committee, setCommittee} = useContext(UserContext);

    const [blockMobile, setBlockMobile] = useState(false)

    useEffect(() => {
        if (isMobile) {
            setBlockMobile(true)
        }
    }, []);


    useEffect(() => {
        const { delegation, agenda, committee } = location.state || {};
        if (delegation, agenda, committee){
            localStorage.clear()
            document.getElementById("delegation").value = delegation;
            document.getElementById("agenda").value = agenda;
            document.getElementById("committee").value = committee;
            if (
                committee !== "DISEC" &&
                committee !== "ECOFIN" &&
                committee !== "UNHRC" &&
                committee !== "UNEP"
            ) {
                setShowOtherCommittee(true)
                document.getElementById("committee").value = "Other"
                //document.getElementById("otherCommittee").value = committee
            }
        }
        if (localStorage.getItem("delegation") && localStorage.getItem("agenda") && localStorage.getItem("committee")) {
            setDelegation(localStorage.getItem("delegation"));
            setAgenda(localStorage.getItem("agenda"));
            setCommittee(localStorage.getItem("committee"));
            navigate("/dashboard");
        }
    }, []);



    function handleSubmit() {
        localStorage.clear();
        const delegation = document.getElementById("delegation").value;
        const agenda = document.getElementById("agenda").value;
        let committee = document.getElementById("committee").value;

        if (committee === "") {
            alert("Please select a committee.");
            return;
        }

        if (committee === "Other") {
            committee = document.getElementById("otherCommittee").value;
            if (committee === "") {
                alert("Please enter a committee name.");
                return;
            }
        }

        if (delegation && agenda) {
            setDelegation(delegation);
            setAgenda(agenda);
            setCommittee(committee);
            async function fetchData() {
                try {
                    const response = await fetch('https://restcountries.com/v3.1/name/' + delegation);
                    let data = await response.json();
                    data = data[0]
                    let name = data.name; 
                    if (name) {
                        localStorage.setItem("delegation", delegation);
                        localStorage.setItem("agenda", agenda);
                        localStorage.setItem("committee", committee);
                        navigate("/dashboard");
                    } 
                    else {
                        alert("Invalid delegation name. Please check the spelling.");
                    }

                } catch (error) {
                    console.error('Error fetching country data:', error);
                    alert("Error fetching country data. Please check the delegation name.");
                }
            }
            fetchData();

        } else {
            alert("Please fill in all fields.");
            return;
        }
        
    }

    const [showOtherCommittee, setShowOtherCommittee] = useState(false);

    useEffect(() => {
        const { delegation, agenda, committee } = location.state || {};

        if (showOtherCommittee) {
            if (committee) {
                document.getElementById("otherCommittee").value = committee
            }
        }
    },[showOtherCommittee])

    function handleCommitteeChange(e) {
        if (e.target.value === "Other") {
            setShowOtherCommittee(true);
        } else {
            setShowOtherCommittee(false);
        }
    }


    return (
        <>
        {!blockMobile && <>
            <div className="homepage">
                <header>
                    <div className="committees">
                        <div className="committee">
                            <img src={process.env.PUBLIC_URL + "/icons/disec.png"} alt="DISEC" />
                            <span>DISEC</span>
                        </div>
                        <div className="committee">
                            <img src={process.env.PUBLIC_URL + "/icons/ecofin.png"} alt="ECOFIN" />
                            <span>ECOFIN</span>
                        </div>
                        <div className="committee">
                            <img src={process.env.PUBLIC_URL + "/icons/unhrc.png"} alt="UNHRC" />
                            <span>UNHRC</span>
                        </div>
                        <div className="committee">
                            <img src={process.env.PUBLIC_URL + "/icons/unep.png"} alt="UNEP" />
                            <span>UNEP</span>
                        </div>
                    </div>
                </header>

                <main>
                    <h1>
                         Delegate <span className="highlight">AI</span>
                    </h1>
                    <p className="subtitle">Prepare for MUNs with AI</p>
                    <div className="form">
                        <input type="text" placeholder="Delegation" id="delegation" />
                        <input type="text" placeholder="Agenda" id="agenda" />
                        <select id="committee"  className="committee_select" onChange={handleCommitteeChange}>
                            <option value="">Select Committee</option>
                            <option value="DISEC">DISEC</option>
                            <option value="ECOFIN">ECOFIN</option>
                            <option value="UNHRC">UNHRC</option>
                            <option value="UNEP">UNEP</option>
                            <option value="Other">Other</option>
                        </select>
                        {showOtherCommittee && (
                            <input
                                type="text"
                                placeholder="Enter committee name"
                                id="otherCommittee"
                            />
                        )}
                        <button type="button" onClick={handleSubmit}>Get Started</button>
                    </div>
                </main>
            </div>
        </>}
        {blockMobile && <>
            <div className="block_page">
                <img className="orange_logo" src={process.env.PUBLIC_URL + "/icons/favicon.png"}/>
                <h1>Delegate <span className="highlight">AI</span></h1>
                <p>This simulation functions only in full committee view — try again on a desktop.</p>
            </div>
        </>}
        </>
    )
}

export default Home;