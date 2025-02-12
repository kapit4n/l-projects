import React, { Component } from "react";
import { Routes, Route } from 'react-router-dom';

import "./App.css";

import List from './projects/list/List';
import Details from './projects/details/Details';
import Add from './projects/add/Add';
import FeatureShow from './features/show'

class App extends Component {
  render() {
    return (
      <div className="container">
        <h2>Welcome to projects in progress</h2>
        <div className="container-projects">
          <div style={{ width: '100%' }}>
            <Routes>
              <Route exact path="/" element={<List />} />
              <Route path="/details/:id" element={<Details />} />
              <Route path="/add" element={<Add />} />
              <Route path="/projects/:projectId/features/:id" element={<FeatureShow />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
