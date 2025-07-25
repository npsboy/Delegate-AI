import React from 'react';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import { useState } from 'react';
import UserContext from '../components/UserContext';
import PositionPaper from './PositionPaper';
import Allies from './Allies';
import Speeches from './Speeches';
import Press from './Press';

function App() {
  const [Delegation, setDelegation] = useState(null);
  const [Agenda, setAgenda] = useState(null);
  const [Committee, setCommittee] = useState(null);

  return (
    <UserContext.Provider value={{Delegation, setDelegation, Agenda, setAgenda, Committee, setCommittee}}>
      <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/position-paper" element={<PositionPaper />} />
            <Route path="/speeches" element={<Speeches />} />
            <Route path="/allies" element={<Allies />} />
            <Route path="/press" element={<Press />} />
          </Routes>
      </HashRouter>
    </UserContext.Provider>
  );
}

export default App;
