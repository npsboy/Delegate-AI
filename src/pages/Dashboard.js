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
    const [loading, setLoading] = useState(false)

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
          localStorage.setItem("CountryData", JSON.stringify({
              capital: data.capital[0],
              population: population,
              flag: data.flags.png,
          }));
          
      } catch (error) {
          console.error('Error fetching country data:', error);
      }
  }

  async function get_stance() {
      setLoading(true)
      const response = await send_to_gpt("In one honest line: What is " + Delegation + "’s actual stance on " + Agenda + "?");
      setStance(response);
      localStorage.setItem("stance", response);
      console.log("set stance")
      setLoading(false)

  }

    useEffect(() => {
        
        if (localStorage.getItem("CountryData") && localStorage.getItem("stance")) {
            setDelegation(localStorage.getItem("delegation"));
            setAgenda(localStorage.getItem("agenda"));
            setCommittee(localStorage.getItem("committee"));
            const storedData = JSON.parse(localStorage.getItem("CountryData"));
            setCountryData(storedData);
            setStance(localStorage.getItem("stance"));
            console.log("committee = ", localStorage.getItem("committee").toLowerCase());

            if ("/icons/" + localStorage.getItem("committee").toLowerCase() + ".png") {
              setCommitteeLogo("/icons/" + localStorage.getItem("committee").toLowerCase() + ".png");
          }
          else {
              setCommitteeLogo("/icons/un.png");
          }
        }
        else{
          fetchCountryData();

          setCommittee(Committee.trim().toUpperCase());

          if ("/icons/" + Committee.trim().toLowerCase() + ".png") {
              setCommitteeLogo("/icons/" + Committee.toLowerCase() + ".png");
          }
          else {
              setCommitteeLogo("/icons/un.png");
          }

          get_stance();
        }
    },[])

    return (
      <>
      {!loading && <>
        <div className="dashboard">
            <Sidebar /> 
        
          <div className="dashboard-main" style={{ backgroundImage: `url('/images/world-map-dark.png')` }}>
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
        </>}
        {loading && <>
        <div className="loading">
          <img id="dashboard-un-logo" src="./icons/un.png"/>
          <h1 className="dashboard-h1">Delegate <span className="highlight">AI</span></h1>
          <p id="loading-text">Loading...</p>
          <img id="dashboard-loading-gif" src="./images/loading-animation.gif"/>
          <p id="loading-text-2">Taking too long? Don't worry this happens only once.</p>
          </div>
        </>}
        </>
    );
}

export default Dashboard;