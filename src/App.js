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
          <div className="container-projects">
            <h2>Welcome to projects in progress</h2>
            <ul className="navbar-nav mr-auto">
              <li><Link to={'/'}>List</Link></li>
            </ul>
            <Switch>
              <Route exact path="/" component={List} />
              <Route path="/details" component={Details} />
              <Route path="/Add" component={Add} />
            </Switch>
            {/* <CategoryComp categories={this.state.categories}
              selectedCats={this.state.selectedCats}
              addCategory={this.addCategory}
              dropCategory={this.dropCategory}
            />
            <SkillsComp
              skills={this.state.skills}
              changedElement={this.changedElement}
            />
            <CardView projects={this.state.projects} /> */}
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
