import React from "react";
import '../pages/Speeches.css';
import Sidebar from "../components/Sidebar";
import SpeechMenu from "../components/SpeechMenu";
import { useEffect } from "react";
import { useContext } from "react";
import UserContext from "../components/UserContext";
import {send_to_gpt} from "../services/BackendServices";
import ReactMarkdown from 'react-markdown';
import SpeechCard from "../components/SpeechCard";

function Speeches() {

    const {Delegation, setDelegation, Agenda, setAgenda, Committee, setCommittee} = useContext(UserContext);


    const [speeches, setSpeeches] = React.useState([
        { id: 1, type: 'gsl', title: 'General Speaker’s List', subtitle: '' },
    ]);
    const [speechContent, setSpeechContent] = React.useState([""]);

    const [currentId, setCurrentId] = React.useState(1);

    const [currentSpeechContent, setCurrentSpeechContent] = React.useState("");
    const [currentSpeech, setCurrentSpeech] = React.useState(speeches[0]);

    const [displaySpeechContent, setDisplaySpeechContent] = React.useState(null);

    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (localStorage.getItem("speechContent")) {
            const savedSpeechContent = JSON.parse(localStorage.getItem("speechContent"));
            setSpeechContent(savedSpeechContent);
        }
        if (localStorage.getItem("speeches")) {
            const savedSpeeches = JSON.parse(localStorage.getItem("speeches"));
            console.log("local storage saved speeches:", savedSpeeches);
            setSpeeches(savedSpeeches);
            setCurrentId(1);
            setDelegation(localStorage.getItem("delegation"));
            setAgenda(localStorage.getItem("agenda"));
            setCommittee(localStorage.getItem("committee"));
        }
        
    },[]);

    useEffect(() => {
        setCurrentSpeechContent(speechContent[currentId - 1]);
    }, [speechContent]);

    useEffect(() => {
        setCurrentSpeech(speeches[currentId-1]);
    }, [currentId]);

    useEffect(() => {
        console.log("speeches updated", speeches);
    }, [speeches]);


    async function writeSpeech(id) {
        let speechType = speeches[id - 1].type;
        let speechSubtitle = speeches[id - 1].subtitle;

        if (speechType === 'mod'){
            speechType = "Moderated Caucus";
            if (!speechSubtitle) {
                alert("Please enter a topic");
                return;
            }
        }

        let prompt = `Write a ${speechType} speech for ${Delegation} on the agenda of ${Agenda} in the ${Committee} committee. in markdown.`;

        if (speechSubtitle) {
            prompt += ` The topic is: ${speechSubtitle}.`;
        }
        setLoading(true);
        const response = await send_to_gpt(prompt)
        speechContent[id - 1] = response;
        setLoading(false);
        setSpeechContent([...speechContent]);
        displaySpeech(id);

        localStorage.setItem("speechContent", JSON.stringify(speechContent));
    }

    function displaySpeech(id) {

        const card = document.querySelector('.card');
        if (speechContent[id - 1] !== undefined && speechContent[id - 1] !== "") {
            setDisplaySpeechContent(true);
        }
        else {
            setDisplaySpeechContent(false);
        }
    }


    function onSelect(id) {
        setCurrentId(id);
        setCurrentSpeech(speechContent[id - 1]);
        displaySpeech(id);
    }

    useEffect(() => {
        displaySpeech(currentId);
    }, [speeches]);


    function onAdd() {
        const newId = speeches.length + 1;
        const newDisplay = { 
            id: newId, 
            type: 'mod', title: `Mod Cauc ${newId-1}`, 
            subtitle: "" 
        };

        setSpeeches([...speeches, newDisplay]);
        setCurrentId(newId);
        setSpeechContent([...speechContent, ""]);

        localStorage.setItem("speeches", JSON.stringify([...speeches, newDisplay]));

    }

    function onDelete(event, id) {
        event.stopPropagation();

        let newSpeeches = speeches.filter(speech => speech.id !== id);
        let newContent = [...speechContent];
        newContent.splice(id - 1, 1); // Remove the content

        // Adjust IDs and titles of speeches after the deleted one
        for (let i = id - 1; i < newSpeeches.length; i++) {
            newSpeeches[i] = {
            ...newSpeeches[i],
            id: i + 1,
            title: `Mod Cauc ${i}`
            };
        }

        setSpeeches(newSpeeches);
        setSpeechContent(newContent);

        if (currentId >= id) {
            setCurrentId(currentId - 1);
            setCurrentSpeechContent(speeches[id - 2]);
        }

        localStorage.setItem("speeches", JSON.stringify(newSpeeches));
        localStorage.setItem("speechContent", JSON.stringify(newContent));
        console.log("speeches set", newSpeeches)
        console.log("speechContent set", newContent);
    }


    function onChange(val, id) {
        let speechesCopy = [...speeches];
        let speech_to_update = speechesCopy.find(speech => speech.id === id);
        if (speech_to_update) {
            speech_to_update.subtitle = val;
            setSpeeches(speechesCopy);
            localStorage.setItem("speeches", JSON.stringify(speechesCopy));
            displaySpeech(id);
        }

    }


    return (
        <div className="speeches-app">
            <Sidebar />
            <div className="container">
                <SpeechMenu
                    speeches={speeches}
                    currentId={currentId}
                    onSelect={onSelect}
                    onAdd={onAdd}
                    onDelete={onDelete}
                    onChange={onChange}
                />

                <div className="card">
                    {!displaySpeechContent && !loading && <SpeechCard id={currentId} speeches={speeches} writeSpeech={writeSpeech} />}
                    {displaySpeechContent && (
                        <div className="speech-content">
                            <ReactMarkdown>{speechContent[currentId - 1]}</ReactMarkdown>
                        </div>
                    )}
                    {loading && <>
                        <h2 className="delegate_ai">Delegate AI</h2>
                        <img src="/icons/un.png" className="un-logo" alt="UN Logo" />
                        <h2>{currentSpeech.title}</h2>
                        <p>Writing...</p>
                        <img className="speeches-loading" src="/images/loading-animation.gif" alt="Loading..." />

                    </>}
                </div>
            </div>
        </div>
    );
}

export default Speeches;