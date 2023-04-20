import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import "./App.css";

import List from './projects/List';
import Details from './projects/Details';
import Add from './projects/Add';

class App extends Component {
  render() {
    return (
      <div className="container">
        <h2>Welcome to projects in progress</h2>
        <div style={{ width: '100%' }}>
          <ul className="navbar-nav mr-auto">
            <li><Link to={'/'}>List</Link></li>
          </ul>
        </div>
        <div className="container-projects">
          <div style={{ width: '100%' }}>
            <Routes>
              <Route exact path="/" element={<List />} />
              <Route path="/details" element={<Details />} />
              <Route path="/Add" element={<Add />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
