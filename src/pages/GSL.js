import React from "react";
import '../pages/GSL.css';
import Sidebar from "../components/Sidebar";
import SpeechMenu from "../components/SpeechMenu";
import { useEffect } from "react";

function GSL() {

    const [menuDisplay, setMenuDisplay] = React.useState([
        { id: 1, type: 'gsl' },
    ]);
    const [speechContent, setSpeechContent] = React.useState([""]);

    const [currentId, setCurrentId] = React.useState(1);

    const [currentSpeechContent, setCurrentSpeechContent] = React.useState("");


    function displaySpeech(id) {

        const card = document.querySelector('.card');
        console.log("menuDisplay", menuDisplay);
        if (id === 1) {
            card.innerHTML = `
                <h2 class="delegate_ai">Delegate AI</h2>
                <img src="/icons/un.png" class="un-logo"/>
                <h2>GSL Speech</h2>
                <button>Write</button>
            `;
        } else {
            card.innerHTML = `
                <h2 class="delegate_ai">Delegate AI</h2>
                <img src="/icons/un.png" class="un-logo"/>
                <h2>${menuDisplay[id - 1].title}</h2>
                <p>${menuDisplay[id - 1].subtitle}</p>
            `;
            console.log("menuDisplay[id - 1].subtitle", menuDisplay[id - 1].subtitle);
        }
    }


    function onSelect(id) {
        setCurrentId(id);
        setCurrentSpeechContent(speechContent[id - 1]);
        displaySpeech(id);
    }


    function onAdd() {
        const newId = menuDisplay.length + 1;
        const newDisplay = { 
            id: newId, 
            type: 'mod', title: `Mod Cauc ${newId-1}`, 
            subtitle: "" 
        };

        setMenuDisplay([...menuDisplay, newDisplay]);
        setCurrentId(newId);
        setSpeechContent([...speechContent, ""]);
    }

    function onDelete(event, id) {
        event.stopPropagation();

        let newMenuDisplay = menuDisplay.filter(speech => speech.id !== id);
        let newContent = [...speechContent];
        newContent.splice(id - 1, 1); // Remove the content

        // Adjust IDs and titles of speeches after the deleted one
        for (let i = id - 1; i < newMenuDisplay.length; i++) {
            newMenuDisplay[i] = {
            ...newMenuDisplay[i],
            id: i + 1,
            title: `Mod Cauc ${i}`
            };
        }

        setMenuDisplay(newMenuDisplay);
        setSpeechContent(newContent);

        if (currentId === id) {
            setCurrentId(id - 1);
            setCurrentSpeechContent(menuDisplay[id - 2]);
        }
    }


    function onChange(val, id) {
        let speech_to_update = menuDisplay.find(speech => speech.id === id);
        if (speech_to_update) {
            speech_to_update.subtitle = val;
            setMenuDisplay([...menuDisplay]);
            displaySpeech(id);
        }
    }


    return (
        <div className="app">
            <Sidebar />
            <div className="container">
                <SpeechMenu
                    speeches={menuDisplay}
                    currentId={currentId}
                    onSelect={onSelect}
                    onAdd={onAdd}
                    onDelete={onDelete}
                    onChange={onChange}
                />

                <div className="card">
                    <h2 className="delegate_ai">Delegate AI</h2>
                    <img src="/icons/un.png" className="un-logo"/>
                    <h2>GSL Speech</h2>
                    <button>Write</button>
                </div>
            </div>
        </div>
    );
}

export default GSL;