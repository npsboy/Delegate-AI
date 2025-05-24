import react from "react";
import { useNavigate } from "react-router-dom";
import './Sidebar.css';

function Sidebar() {
    const navigate = useNavigate();
    function handleCreatePositionPaper() {
        navigate('/position-paper');
    }
    return (
        <div className="sidebar">
            <h1>
              Delegate <span className="highlight">AI</span>
            </h1>
            <ul>
              <li onClick={handleCreatePositionPaper}>Create position paper</li>
              <li>Draft speeches</li>
              <li>View allies</li>
            </ul>
          </div>
    )
}

export default Sidebar;