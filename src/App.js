import React, { Component } from "react";
import "./App.css";
import CardView from "./comps/CardView";
import axios from "axios";
import CategoryComp from "./comps/CategoryComp";
import SkillsComp from "./comps/SkillsComp";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      projectsOriginal: [],
      categories: [],
      skills: []
    };
    this.changedElement = this.changedElement.bind(this);
  }

  componentDidMount() {
    axios.get(`/data/projects.json`).then(res => {
      const projects = res.data.slice();
      const projectsOriginal = res.data.slice();
      this.setState({ projects, projectsOriginal });
    });

    axios.get(`/data/categories.json`).then(res => {
      const categories = res.data;
      this.setState({ categories });
    });

    axios.get(`/data/skills.json`).then(res => {
      const skills = res.data;
      this.setState({ skills });
    });
  }

  changedElement(selected) {
    console.log(selected);
    if (selected.length > 0) {
      let projects = this.state.projectsOriginal.filter(project => {
        let i = 0;
        let j = 0;
        while (i < selected.length) {
          j = 0;
          while (j < project.skills.length) {
            if (
              selected[i].name.toLowerCase() ===
              project.skills[j].name.toLowerCase()
            ) {
              return true;
            }
            j++;
          }
          i++;
        }
        return false;
      });
      console.log(this.state.projects);
      console.log(projects);
      this.setState({
        projects: []
      });
      this.setState({
        projects
      });
      console.log(this.state.projects);
    } else {
      this.setState({
        projects: this.state.projectsOriginal
      });
    }
  }

  render() {
    return (
      <div className="container">
        <div className="container-projects">
          <CategoryComp categories={this.state.categories} />
          <SkillsComp
            skills={this.state.skills}
            changedElement={this.changedElement}
          />
          <CardView projects={this.state.projects} />
        </div>
      </div>
    );
  }
}

export default App;
