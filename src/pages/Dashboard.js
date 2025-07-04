import React, { useEffect } from "react";
import styles from '../pages/Dashboard.module.css';
import { useState } from 'react';
import { useContext } from 'react';
import UserContext from '../components/UserContext';
import { send_to_gpt } from "../services/BackendServices";
import Sidebar from "../components/Sidebar";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const { Delegation, setDelegation, Agenda, setAgenda, Committee, setCommittee } = useContext(UserContext);

  const [countryData, setCountryData] = useState(null);
  const [committee_logo, setCommitteeLogo] = useState(null);
  const [stance, setStance] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchCountryData() {
    try {
      const normalizedDelegation = Delegation.trim().toLowerCase();
      const netherlandsVariants = [
        "netherlands",
        "the netherlands",
        "kingdom of the netherlands",
        "kingdom of netherlands",
        "netherland"
      ];
      let response;
      if (!netherlandsVariants.includes(normalizedDelegation)) {
        if (normalizedDelegation === "uk") {
          response = await fetch('https://restcountries.com/v3.1/name/gb');

        }
        else {
          response = await fetch('https://restcountries.com/v3.1/name/' + Delegation);
        }
      }
      else {
        response = await fetch('https://restcountries.com/v3.1/alpha/nld');
      }
      let data = await response.json();
      data = data[0];
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
      });
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
    setLoading(true);

    let prompt = `Reply with one word: true or false.
                  Is this a valid and reasonable MUN committee and agenda pair?
                  If the committee is fake or the agenda doesn't fit the committee, return false
                  committee: ${Committee}
                  Agenda ${Agenda}`;
    let response = await send_to_gpt(prompt);
    response = response.toString().trim().replace(/\./g, '').toLowerCase();
    if (response === "false") {
      alert("invalid Agenda or Committee");
       navigate('/', {
        state: {
          delegation: Delegation,
          agenda: Agenda,
          committee: Committee
        }
      });
    }

    prompt = "In one honest line: What is " + Delegation + "’s actual stance on " + Agenda + "?";
    response = await send_to_gpt(prompt);
    setStance(response);
    localStorage.setItem("stance", response);
    console.log("set stance");
    setLoading(false);
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
        setCommitteeLogo(process.env.PUBLIC_URL + "/icons/" + localStorage.getItem("committee").toLowerCase() + ".png");
      }
      else {
        setCommitteeLogo(process.env.PUBLIC_URL + "/icons/un.png");
      }
    }
    else {
      fetchCountryData();

      setCommittee(Committee.trim().toUpperCase());
      if ("/icons/" + Committee.trim().toLowerCase() + ".png") {
        setCommitteeLogo(process.env.PUBLIC_URL + "/icons/" + Committee.toLowerCase() + ".png");
      }
      else {
        console.log("setting url");
        setCommitteeLogo(process.env.PUBLIC_URL + "/icons/un.png");
      }

      get_stance();
    }
  }, []);


  return (
    <>
      {!loading && <>
        <div className={styles.dashboard}>
          <Sidebar />

          <div className={styles.dashboard_main} style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/images/world-map-dark.png'})` }}>
            <div className={styles.center_section}>
              <h2 className={styles.committee_text}>
                <span>
                  {Committee}  <img className={styles.committee_logo} src={committee_logo} onError={(e) => { e.target.src = process.env.PUBLIC_URL + "/icons/un.png"; }} alt="DISEC" />
                </span>
              </h2>
              <p className={styles.agenda_label}>Agenda:</p>
              <p className={styles.agenda_text}>
                {Agenda ? Agenda : 'Loading...'}
              </p>
            </div>

            <div className={styles.country_section}>
              <h2 className={styles.country}>
                {Delegation ? Delegation.toUpperCase() : "Loading..."}
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
          <img className={styles.dashboard_un_logo} src={process.env.PUBLIC_URL + "/icons/un.png"} />
          <h1 className={styles.dashboard_title}>Delegate <span className={styles.highlight}>AI</span></h1>
          <p className={styles.loading_text}>Loading...</p>
          <img className={styles.dashboard_loading_gif} src={process.env.PUBLIC_URL + "/images/loading-animation.gif"} />
          <p className={styles.loading_text_2}>Taking too long? Don't worry this happens only once.</p>
        </div>
      </>}
    </>
  );
}

export default Dashboard;
