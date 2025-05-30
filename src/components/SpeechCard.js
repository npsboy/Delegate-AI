import React from "react";

function SpeechCard({ id, speeches, writeSpeech }) {
  const speech = speeches[id - 1];
  console.log("id:", id);
  console.log("speeches:", speeches);
  return (
    <>
      <h2 className="delegate_ai">Delegate AI</h2>
      <img src={process.env.PUBLIC_URL + "/icons/un.png"} className="un-logo" alt="UN Logo" />
      <h2>{speech.title}</h2>
      <p>{speech.subtitle}</p>
      <button onClick={() => writeSpeech(id)}>Write</button>
    </>
  );
}

export default SpeechCard;