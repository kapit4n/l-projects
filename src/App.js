import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';

import List from './projects/list/List';
import Details from './projects/details/Details';
import Add from './projects/add/Add';
import FeatureShow from './features/show';

class App extends Component {
  render() {
    return (
      <Routes>
        <Route exact path="/" element={<List />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/add" element={<Add />} />
        <Route
          path="/projects/:projectId/features/:id"
          element={<FeatureShow />}
        />
      </Routes>
    );
  }
}

export default App;
