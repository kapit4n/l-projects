import React, { Component } from 'react';
import './App.css';
import CardView from './comps/CardView'
import axios from 'axios';
import CategoryComp from './comps/CategoryComp';
import SkillsComp from './comps/SkillsComp';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      projects: [],
      categories: [],
      skills: []
    }
  }

  componentDidMount() {
    axios.get(`http://localhost:3000/data/projects.json`)
      .then(res => {
        const projects = res.data;
        this.setState({ projects });
      })

    axios.get(`http://localhost:3000/data/categories.json`)
      .then(res => {
        const categories = res.data;
        this.setState({ categories });
      })
      
    axios.get(`http://localhost:3000/data/skills.json`)
      .then(res => {
        const skills = res.data;
        this.setState({ skills });
      })

  }

  filterIt() {
    console.log("Filter should go here");    
  }

  render() {
    return (
      <div className="container">
        <div className="container-projects">
        <CategoryComp categories={this.state.categories}></CategoryComp>
        <SkillsComp skills={this.state.categories}></SkillsComp>
        <CardView projects={this.state.projects}></CardView>
        </div>
      </div>
    )
  }
}

export default App;
