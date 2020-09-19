import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import "./App.css";
import CardView from "./comps/CardView";
import CategoryComp from "./comps/CategoryComp";
import SkillsComp from "./comps/SkillsComp";


import List from './projects/List';
import Details from './projects/Details';
import Add from './projects/Add';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <h2>Welcome to projects in progress</h2>
          <div style={{ width: '100%' }}>
            <ul className="navbar-nav mr-auto">
              <li><Link to={'/'}>List</Link></li>
            </ul>
          </div>
          <div className="container-projects">
            <div style={{ width: '100%' }}>
              <Switch>
                <Route exact path="/" component={List} />
                <Route path="/details" component={Details} />
                <Route path="/Add" component={Add} />
              </Switch>

            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
