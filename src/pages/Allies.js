import React, { useState, useEffect, useContext } from "react";
import "./Allies.css";
import Sidebar from "../components/Sidebar";
import UserContext from "../components/UserContext";
import { send_to_gpt } from "../services/BackendServices";
import LoadingScreen from "../components/LoadingScreen";

function Allies() {
    const [allies, setAllies] = useState([
        { name: "New Zealand", flag: "https://flagcdn.com/nz.svg" },
        { name: "France", flag: "https://flagcdn.com/fr.svg" },
        { name: "Canada", flag: "https://flagcdn.com/ca.svg" },
        { name: "Japan", flag: "https://flagcdn.com/jp.svg" },
        { name: "Brazil", flag: "https://flagcdn.com/br.svg" },
        { name: "Germany", flag: "https://flagcdn.com/de.svg" },
        { name: "South Africa", flag: "https://flagcdn.com/za.svg" },
        { name: "India", flag: "https://flagcdn.com/in.svg" },
    ]);

    const [rivals, setRivals] = useState([
        { name: "Russia", flag: "https://flagcdn.com/ru.svg" },
        { name: "China", flag: "https://flagcdn.com/cn.svg" },
        { name: "North Korea", flag: "https://flagcdn.com/kp.svg" },
        { name: "Iran", flag: "https://flagcdn.com/ir.svg" },
        { name: "Syria", flag: "https://flagcdn.com/sy.svg" },
        { name: "Pakistan", flag: "https://flagcdn.com/pk.svg" },
        { name: "Venezuela", flag: "https://flagcdn.com/ve.svg" },
        { name: "Cuba", flag: "https://flagcdn.com/cu.svg" },
    ]);

    const {
        Delegation,
        setDelegation,
        Agenda,
        setAgenda,
        Committee,
        setCommittee,
    } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    async function fetchAlliesAndRivals() {
        const format = `{"allies": [{"countryCode": "il", "country": "Israel"}], "rivals": []}`;
        const prompt = `give me a JSON of 8 allies and 4 top rivals (+their ISO 3166-1 alpha-2 code) for the country ${Delegation} in the context of the agenda ${Agenda} in the committee ${Committee}. DO NOT REPEAT ANY ITEMS. format= ${format}`;
        const response = await send_to_gpt(prompt);
        console.log(prompt);
        let data = JSON.parse(response);
        if (data && data.allies && data.rivals) {
            let allies = data.allies;
            let rivals = data.rivals;

            allies = allies.map((country) => {
                let code =
                    country.countryCode.toLowerCase() === "uk"
                        ? "gb"
                        : country.countryCode.toLowerCase() === "sk"
                        ? "kr"
                        : country.countryCode.toLowerCase();
                return { name: country.country, flag: `https://flagcdn.com/${code}.svg` };
            });
            console.log("allies are = ", allies);

            rivals = rivals.map((country) => ({
                name: country.country,
                flag: `https://flagcdn.com/${country.countryCode.toLowerCase()}.svg`,
            }));

            setAllies(allies);
            setRivals(rivals);
            console.log("allies are = ", allies);
            localStorage.setItem("allies", JSON.stringify(allies));
            localStorage.setItem("rivals", JSON.stringify(rivals));
            setLoading(false);
        } else {
            console.error("Invalid response format:", response);
        }
    }

    useEffect(() => {
        setDelegation(localStorage.getItem("delegation"));
        setAgenda(localStorage.getItem("agenda"));
        setCommittee(localStorage.getItem("committee"));
        if (localStorage.getItem("allies")) {
            setAllies(JSON.parse(localStorage.getItem("allies")));
            console.log("allies from localStorage", JSON.parse(localStorage.getItem("allies")));
            setRivals(JSON.parse(localStorage.getItem("rivals")));
            setLoading(false);
        }
         else {
            fetchAlliesAndRivals();
        }
    }, []);

    return (
        <div className="allies-app">
            <Sidebar />
            <div className="main">
                {!loading && (
                    <>
                        <div className="section allies">
                            <h2 className="section-title">Allies:</h2>
                            <div className="countries">
                                {allies.map((country, index) => (
                                    <div className="country" key={index}>
                                        <span>{country.name}</span>
                                        <img src={country.flag} alt={country.name} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="section rivals">
                            <h2 className="section-title">Rivals:</h2>
                            <div className="countries">
                                {rivals.map((country, index) => (
                                    <div className="country" key={index}>
                                        <span>{country.name}</span>
                                        <img src={country.flag} alt={country.name} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {loading && (
                    <LoadingScreen label="Loading Allies and Rivals..." />
                )}
            </div>
        </div>
    );
}

export default Allies;