import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CardView from './CardView'
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      projects: []
    }
  }

  componentDidMount() {
    axios.get(`http://localhost:3000/data/projects.json`)
      .then(res => {
        const projects = res.data;
        this.setState({ projects });
      })
  }

  render() {
    return (
      <div>
        <CardView projects={this.state.projects}></CardView>
      </div>
    )
  }
}

export default App;
