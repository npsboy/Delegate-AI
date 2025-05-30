import React, { useEffect } from "react";
import styles from '../pages/Dashboard.module.css';
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
              console.log("setting url")
              setCommitteeLogo(process.env.PUBLIC_URL + "/icons/un.png");
          }

          get_stance();
        }
    },[])

    return (
      <>
        {!loading && <>
          <div className={styles.dashboard}>
            <Sidebar />
        
            <div className={styles.dashboard_main} style={{ backgroundImage: `url('/images/world-map-dark.png')` }}>
              <div className={styles.center_section}>
                <h2 className={styles.committee_text}>
                  <span>
                    {Committee}  <img className={styles.committee_logo} src={committee_logo}    onError={(e) => { e.target.src = process.env.PUBLIC_URL + "/icons/un.png"; }} alt="DISEC" />
                  </span>
                </h2>
                <p className={styles.agenda_label}>Agenda:</p>
                <p className={styles.agenda_text}>
                  {Agenda ? Agenda : 'Loading...'}
                </p>
              </div>
        
              <div className={styles.country_section}>
                <h2 className={styles.country}>
                  {Delegation}
                  <span><img className={styles.flag} src={countryData ? countryData.flag : ""} /></span>
                </h2>
                <p>
                  <span className={styles.label}>Capital:</span> {countryData ? countryData.capital : 'Loading...'}
                </p>
                <p>
                  <span className={styles.label}>Population:</span> {countryData ? countryData.population : 'Loading...'}
                </p>
                <hr />
                <p className={styles.stance_label}>Stance:</p>
                <p className={styles.stance_text}>{stance ? stance : 'The stance of this country seems to be unclear'}</p>
              </div>
            </div>
          </div>
        </>}
        {loading && <>
          <div className={styles.loading}>
            <img className={styles.dashboard_un_logo} src="./icons/un.png" />
            <h1 className={styles.dashboard_title}>Delegate <span className={styles.highlight}>AI</span></h1>
            <p className={styles.loading_text}>Loading...</p>
            <img className={styles.dashboard_loading_gif} src="./images/loading-animation.gif" />
            <p className={styles.loading_text_2}>Taking too long? Don't worry this happens only once.</p>
          </div>
        </>}
      </>
    );
}

export default Dashboard;