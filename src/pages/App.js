import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import { useState } from 'react';
import UserContext from '../components/UserContext';
import PositionPaper from './PositionPaper';
import GSL from './GSL';

function App() {
  const [Delegation, setDelegation] = useState(null);
  const [Agenda, setAgenda] = useState(null);
  const [Committee, setCommittee] = useState(null);

  return (
    <UserContext.Provider value={{Delegation, setDelegation, Agenda, setAgenda, Committee, setCommittee}}>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/position-paper" element={<PositionPaper />} />
            <Route path="/gsl" element={<GSL />} />
          </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
