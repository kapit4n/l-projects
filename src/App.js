import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';

import List from './projects/list/List';
import Details from './projects/details/Details';
import Docs from './projects/docs/Docs';
import Add from './projects/add/Add';
import FeatureShow from './features/show';
import ScrapedRepos from './scraped-repos/ScrapedRepos';
import ArchivedRepos from './archived-repos/ArchivedRepos';
import Notebooks from './notebooks/Notebooks';

class App extends Component {
  render() {
    return (
      <Routes>
        <Route exact path="/" element={<List />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/projects/:name/docs" element={<Docs />} />
        <Route path="/add" element={<Add />} />
        <Route
          path="/projects/:projectId/features/:id"
          element={<FeatureShow />}
        />
        <Route path="/scraped-repos" element={<ScrapedRepos />} />
        <Route path="/archived-repos" element={<ArchivedRepos />} />
        <Route path="/notebooks" element={<Notebooks />} />
      </Routes>
    );
  }
}

export default App;
