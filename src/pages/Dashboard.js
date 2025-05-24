import React, { useEffect } from "react";
import '../pages/Dashboard.css';
import { useState } from 'react';
import { useContext } from 'react';
import UserContext from '../components/UserContext';
import {send_to_gpt} from "../services/BackendServices";
import Sidebar from "../components/Sidebar";

function Dashboard() {
    const {Delegation, setDelegation, Agenda, setAgenda, Committee, setCommittee} = useContext(UserContext);

    const [countryData, setCountryData] = useState(null);

    const [committee_logo, setCommitteeLogo] = useState(null);

    const [stance, setStance] = useState(null);

    useEffect(() => {
        async function fetchCountryData() {
            try {
                const response = await fetch('https://restcountries.com/v3.1/name/' + Delegation);
                let data = await response.json();
                data = data[0]
                let population = data.population;

                function numberToWords(num) {
                    if (num >= 1_000_000_000) {
                        return (num / 1_000_000_000).toFixed(1) + " billion";
                    } else if (num >= 1_000_000) {
                        return (num / 1_000_000).toFixed(1) + " million";
                    } else if (num >= 1_000) {
                        return (num / 1_000).toFixed(1) + " thousand";
                    }
                    return num.toString();
                }
                population = numberToWords(population);

                setCountryData({
                    capital: data.capital[0],
                    population: population,
                    flag: data.flags.png,    
                })
                
            } catch (error) {
                console.error('Error fetching country data:', error);
            }
        }
        fetchCountryData();

        setCommittee(Committee.trim().toUpperCase());

        if ("/icons/" + Committee.trim().toLowerCase() + ".png") {
            setCommitteeLogo("/icons/" + Committee.toLowerCase() + ".png");
        }
        else {
            setCommitteeLogo("/icons/disec.png");
        }

        setStance(send_to_gpt("In one honest line: What is " + Delegation + "’s actual stance on " + Agenda + "?"));

    },[])

    return (
        <div className="app">
            <Sidebar /> 
        
          <div className="main" style={{ backgroundImage: `url('/images/world-map-dark.png')` }}>
            <div className="center-section">
              <h2 className="disec">
                <span>
                    {Committee}  <img  className="committee_logo" src={committee_logo} alt="DISEC" />
                </span>
              </h2>
              <p className="agenda-label">Agenda:</p>
              <p className="agenda-text">
                {Agenda ? Agenda : 'Loading...'}
              </p>
            </div>
        
            <div className="country-section">
              <h2 className="country">
                {Delegation} 
                <span><img className="flag" src={countryData? countryData.flag : ""}/></span>
              </h2>
              <p>
                <span className="label">Capital:</span> {countryData ? countryData.capital : 'Loading...'}
              </p>
              <p>
                <span className="label">Population:</span> {countryData ? countryData.population : 'Loading...'}
              </p>
              <hr />
              <p className="stance-label">Stance:</p>
              <p className="stance-text">{stance? stance : 'The stance of this country seems to be unclear'}</p>
            </div>
          </div>
        </div>
    );
}

export default Dashboard;