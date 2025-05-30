import React from "react";
import { useState } from "react";
import { useEffect } from "react";

function SpeechCard({ id, speeches, writeSpeech }) {
  const speech = speeches[id - 1];
  console.log("id:", id);
  console.log("speeches:", speeches);
  const [defaultWordLimit, setdefaultWordLimit] = useState("120")

  useEffect(() => {
    if (speech.title === "General Speaker’s List") {
      setdefaultWordLimit("120");
    } else {
      console.log("setting to 70");
      setdefaultWordLimit("70");
    }
  }, [speech.subtitle]);

  return (
    <>
      <h2 className="delegate_ai">Delegate AI</h2>
      <img src={process.env.PUBLIC_URL + "/icons/un.png"} className="un-logo" alt="UN Logo" />
      <h2>{speech.title}</h2>
      <p>{speech.subtitle}</p>
      <select id="word-limit" value={defaultWordLimit} onChange={(e) => setdefaultWordLimit(e.target.value)}>
        <option value="120">120 words (1 min)</option>
        <option value="90">90 words (45 sec)</option>
        <option value="70">70 words (30 sec)</option>
      </select>
      <br/>
      <button onClick={() => writeSpeech(id, defaultWordLimit)}>Write</button>
    </>
  );
}

export default SpeechCard;