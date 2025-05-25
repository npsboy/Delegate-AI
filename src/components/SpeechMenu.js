import React from "react";
import './SpeechMenu.css';
import { useEffect } from "react";

function SpeechMenu({ speeches, currentId, onSelect, onAdd, onDelete, onChange }) {
    const [hoveredId, setHoveredId] = React.useState(null);

    return (
        <div className="menu">
            {speeches.map((speech) => (
                <div
                    key={speech.id}
                    className="timeline"
                    onClick={() => onSelect(speech.id)}
                    onMouseEnter={() => setHoveredId(speech.id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                    <div className={`dot ${currentId === speech.id ? 'active' : ''}`}></div>
                    <div className="text_container">
                        {speech.type === 'gsl' ? (
                            <span className="text">General Speaker’s List</span>
                        ) : (
                            <>
                                <span className="topic_title">{speech.title}:</span>
                                <span className="text">
                                    <input
                                        type="text"
                                        value={speech.subtitle}
                                        onChange={(e) => onChange(e.target.value, speech.id)}
                                        placeholder="Enter topic"
                                        className="topic_input"
                                    />
                                    {hoveredId === speech.id && (
                                        <img
                                            className="delete_icon"
                                            src="/images/delete.png"
                                            alt="Delete"
                                            onClick={(event) => onDelete(event, speech.id)}
                                        />
                                    )}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            ))}

            <div className="timeline" onClick={onAdd}>
                <div className="dot"></div>
                <div className="text_container">
                    <span className="add">+ Add</span>
                </div>
            </div>
        </div>
    );
}

export default SpeechMenu;