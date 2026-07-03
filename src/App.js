import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';

import List from './projects/list/List';
import Details from './projects/details/Details';
import Add from './projects/add/Add';
import FeatureShow from './features/show';
import ScrapedRepos from './scraped-repos/ScrapedRepos';
import ArchivedRepos from './archived-repos/ArchivedRepos';

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
        <Route path="/scraped-repos" element={<ScrapedRepos />} />
        <Route path="/archived-repos" element={<ArchivedRepos />} />
      </Routes>
    );
  }
}

export default App;
