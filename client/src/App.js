import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import './App.css';

import RegisterClient from './pages/RegisterClient';
import CreateProgram from './pages/CreateProgram';
import SearchClients from './pages/SearchClients';
import ClientList from './pages/ClientList';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="navbar">
          <h1 className="logo">Health InfoSys</h1>
          <nav>
            <ul className="nav-links">
              <li><NavLink to="/" end activeClassName="active">Register</NavLink></li>
              <li><NavLink to="/create-program" activeClassName="active">Create Program</NavLink></li>
              <li><NavLink to="/search-clients" activeClassName="active">Search</NavLink></li>
              <li><NavLink to="/client-list" activeClassName="active">Clients</NavLink></li>
            </ul>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<RegisterClient />} />
            <Route path="/create-program" element={<CreateProgram />} />
            <Route path="/search-clients" element={<SearchClients />} />
            <Route path="/client-list" element={<ClientList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
