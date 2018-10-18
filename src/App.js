import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      projects: [
        {
          name: "Football-two",
          dir: "https://github.com/kapit4n/football-two",
          features: [
            { text: "Championships", done: false },
            { text: "Teams", done: false },
            { text: "Matches", done: false }
          ]
        },
        {
          name: "ng-vendei",
          dir: "https://github.com/kapit4n/ng-vendei",
          features: [
            { text: "Shopping cart", done: false },
            { text: "Products List", done: false },
            { text: "Orders", done: false }
          ]
        },
        {
          name: "react-2seller",
          dir: "https://github.com/kapit4n/react-2seller",
          features: [
            { text: "Shopping cart", done: false },
            { text: "Products List", done: false },
            { text: "Orders", done: false }
          ]
        },
        {
          name: "l-projects",
          dir: "https://github.com/kapit4n/l-projects",
          features: [
            { text: "Projects view", done: false },
            { text: "Project planning", done: false },
            { text: "Project features", done: false }
          ]
        },
        {
          name: "time-tracker",
          dir: "https://github.com/kapit4n/l-tracker",
          features: [
            { text: "Register start", done: false },
            { text: "Register end", done: false },
            { text: "Calculate", done: false }
          ]
        },
        {
          name: "t-stock",
          dir: "https://github.com/kapit4n/t-stock",
          features: [
            { text: "Shopping cart", done: false },
            { text: "Products List", done: false },
            { text: "Orders", done: false }
          ]
        }
      ]
    }
  }

  render() {
    return (
      <div>
        {this.state.projects.map(project => (
          <div className="hex">
            <div className="top"></div>
            <div className="middle">
              <h2>{project.name}</h2>
              <ul>
                {project.features.map(feature => (
                  <li key={feature.id}>
                    <label>
                      <span>{feature.text}</span>
                    </label>
                  </li>
                ))}
                <li><a href={project.dir}>open</a></li>
              </ul>
            </div>
            <div className="bottom"></div>


          </div>
        ))

        }

      </div>
    )
  }
}

export default App;
