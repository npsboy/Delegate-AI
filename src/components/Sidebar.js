import react from "react";
import { useNavigate } from "react-router-dom";
import './Sidebar.css';

function Sidebar() {
    const navigate = useNavigate();
    function handleCreatePositionPaper() {
        navigate('/position-paper');
    }
    function handleDeleteHistory () {
      localStorage.clear()
      navigate('/')
    }
    return (
        <div className="sidebar">
            <h1>
              Delegate <span className="highlight">AI</span>
            </h1>
            <ul>
              <li onClick={() => navigate('/dashboard')}>Dashboard</li>
              <li onClick={handleCreatePositionPaper}>Position paper</li>
              <li onClick={() => navigate('/speeches')}>Draft speeches</li>
              <li onClick={() => navigate('/allies')}>View allies</li>
              <li onClick={() => navigate('/press')}>Press Yourself</li>
            </ul>
            <span className="delete" onClick={handleDeleteHistory}>
              <a>Start Afresh</a>
              <img src={process.env.PUBLIC_URL + "/images/delete.png"}/>
            </span>
        </div>
    )
}

export default Sidebar;