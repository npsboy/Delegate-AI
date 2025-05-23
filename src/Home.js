import React from "react";
import './Home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import { useContext } from "react";

function Home() {

    const navigate = useNavigate();

    const {Delegation, setDelegation, Agenda, setAgenda, Committee, setCommittee} = useContext(UserContext);

    function handleSubmit() {

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

    function handleCommitteeChange(e) {
        if (e.target.value === "Other") {
            setShowOtherCommittee(true);
        } else {
            setShowOtherCommittee(false);
        }
    }

    return (
        <div className="homepage">
            <header>
                <div className="committees">
                    <div className="committee">
                        <img src="/icons/disec.png" alt="DISEC" />
                        <span>DISEC</span>
                    </div>
                    <div className="committee">
                        <img src="/icons/ecofin.png" alt="ECOFIN" />
                        <span>ECOFIN</span>
                    </div>
                    <div className="committee">
                        <img src="/icons/unhrc.png" alt="UNHRC" />
                        <span>UNHRC</span>
                    </div>
                    <div className="committee">
                        <img src="/icons/unep.png" alt="UNEP" />
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
                    <select id="committee" onChange={handleCommitteeChange}>
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
    )
}

export default Home;