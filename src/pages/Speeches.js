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
import { render } from "@testing-library/react";

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

    const [openInChat, setOpenInChat] = React.useState(true)

    const[chatHis, setChatHis] = React.useState([])

    useEffect(() => {
        console.log("local storage inside useeffect = ", localStorage)
        if (localStorage.getItem("speechContent")) {
            const savedSpeechContent = JSON.parse(localStorage.getItem("speechContent"));
            setSpeechContent(savedSpeechContent);
            displaySpeech(1)
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
        displaySpeech(currentId)
    }, [speechContent]);

    useEffect(() => {
        setCurrentSpeech(speeches[currentId-1]);
    }, [currentId]);

    useEffect(() => {
        console.log("speeches updated", speeches);
    }, [speeches]);


    async function writeSpeech(id, wordLimit) {
        let speechType = speeches[id - 1].type;
        let speechSubtitle = speeches[id - 1].subtitle;

        if (speechType === 'mod'){
            speechType = "Moderated Caucus";
            if (!speechSubtitle) {
                alert("Please enter a topic");
                return;
            }
        }

        let prompt = `Write a ${speechType} speech for ${Delegation} on the agenda of ${Agenda} in the ${Committee} committee. in markdown. word limit = ${wordLimit}`;
        if (speechSubtitle) {
            prompt += ` The topic is: ${speechSubtitle}.`;
        }
        setLoading(true);
        const response = await send_to_gpt(prompt)
        let speechContent_copy = [...speechContent]
        speechContent_copy[id - 1] = response;
        localStorage.setItem("speechContent", JSON.stringify(speechContent_copy));
        console.log("local storage after set = ", localStorage)
        setLoading(false);
        setDisplaySpeechContent(true)
        setSpeechContent(speechContent_copy);

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

    useEffect(() => {
      const input = document.getElementById("chat_input");

      function handleKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault(); // Prevents new line
          sendMessage();
        }
      }

      if (input) {
        input.addEventListener("keydown", handleKeyDown);
      }

      return () => {
        if (input) {
          input.removeEventListener("keydown", handleKeyDown);
        }
      };
    }, []);

    useEffect(() => {
        if (loading) {
            setDisplaySpeechContent(false)
        }
    },[loading])


    async function sendMessage () {
        setLoading(true)
        setDisplaySpeechContent(false)
        const message = document.getElementById("chat_input").value 
        let chatHis_copy = [...chatHis]
        chatHis_copy.push({"role":"user", "message": message})
        setChatHis(prev => [...prev, {role: "user", message: message}])
        document.getElementById("chat_input").value = ""

        console.log("chatHis coppy = ", chatHis_copy)
        let old_speech = JSON.parse(localStorage.getItem("speechContent"))
        old_speech = old_speech[currentId-1]
        const format = `{"chat":"---blah blah---", "speech":"Honorable chair and ..."}`
        const prompt = `
        You are an assistant that edits speeches based on user requests.

        Instructions:
        - Proceed only if the request pertains directly to editing the speech.
        - If the request is unrelated to editing the speech, respond with exactly: {"chat":"invalid"}

        Current speech:
        """${old_speech}"""

        User request:
        """${message}"""

        Requirements:
        - Edit the speech as per the user's request.
        - Return the response strictly in JSON format, matching the following template:
          ${format}
        - The JSON should be a single-line string without line breaks or additional whitespace.
        - Do not include any explanations, comments, or extraneous text.

        Ensure that the output is a valid JSON object conforming exactly to the specified format.
        `;

        let response = await send_to_gpt(prompt)
        console.log("response: ", response)
        try {
            response = JSON.parse(response)
        }
        catch(err){
            response = await send_to_gpt(prompt)
            try{
                response = JSON.parse(response)
            }
            catch(err){
                console.log("response error: ", response)
                alert("Error modifying speech. Try later")
                return
            }
        }
        const chat_reply = response.chat
        if (chat_reply == "invalid") {
            setChatHis(prev => [...prev, {role: "bot", message: `Let’s keep things on track! I can only help with editing your speech. Ask me how to improve your argument, tone, or clarity!`}])
            setLoading(false)
            setDisplaySpeechContent(true)
            return
        }
        chatHis_copy.push({"role":"bot", "message": chat_reply})
        setChatHis(prev => [...prev, {role: "bot", message: chat_reply}])

        const new_speech = response.speech
        let speech_content_copy = [...speechContent]
        speech_content_copy[currentId-1] = new_speech
        setSpeechContent(speech_content_copy)
        localStorage.setItem("speechContent", JSON.stringify(speech_content_copy))
        setLoading(false)
        setDisplaySpeechContent(true)
    }

    function renderChat(chat){
        if (chat.role === "user") {
            return(
                <div className="userMessage">{chat.message}</div>
            )
        }
        else {
            return(
                <div className="botReply_area">
                    <img src={process.env.PUBLIC_URL + "/images/chatbot_regular.png"} />
                    <div className="reply">
                        {chat.message}
                    </div>
                </div>
            )
        }
    }

    function AutoScrollDiv(props) {
        useEffect(function () {
          var div = document.getElementById('chatDisplay');
          if (div) {
            div.scrollTop = div.scrollHeight;
          }
        }, [chatHis]);
    }
    return (
        <div className="speeches-app">
            {!openInChat && <>
            <Sidebar />
            </>}
            <div className="container">
                {!openInChat && <>
                <SpeechMenu
                    speeches={speeches}
                    currentId={currentId}
                    onSelect={onSelect}
                    onAdd={onAdd}
                    onDelete={onDelete}
                    onChange={onChange}
                />
                </>}

                <div className="card">
                    {!displaySpeechContent && !loading && <SpeechCard id={currentId} speeches={speeches} writeSpeech={writeSpeech} />}
                    {displaySpeechContent && (
                        <div className="speech-content">
                            <ReactMarkdown>{speechContent[currentId - 1]}</ReactMarkdown>
                        </div>
                    )}
                    {loading && <>
                        <h2 className="delegate_ai">Delegate AI</h2>
                        <img src={process.env.PUBLIC_URL + "/icons/un.png"} className="un-logo" alt="UN Logo" />
                        <h2>{currentSpeech.title}</h2>
                        <p>Writing...</p>
                        <img className="speeches-loading" src={process.env.PUBLIC_URL + "/images/loading-animation.gif"} alt="Loading..." />

                    </>}
                </div>
                {openInChat && <>
                <div className="Chat">
                    <img className="chatbot_img" src={process.env.PUBLIC_URL + "/images/chatbot.png"}/>
                    <h1 className="chat_title">
                        Delegate <span className="highlight">AI</span>
                    </h1>
                    <p className="chat_subtitle">Modify Your Speech</p>
                    <div className="chatDisplay" id="chatDisplay">
                        {chatHis.map(renderChat)}
                    </div>
                    <span className="input_area">
                        <textarea placeholder="Type here" id="chat_input"/>
                        <div className="send_area"> 
                            <img className="send_button" src={process.env.PUBLIC_URL + "/images/send.png"}/>
                        </div>
                    </span>
                    
                </div>
                </>}
            </div>
        </div>
    );
}

export default Speeches;