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
    this.filterIt = this.filterIt.bind(this);
  }

  componentDidMount() {
    axios.get(`http://localhost:3000/data/projects.json`).then(res => {
      const projects = res.data;
      const projectsOriginal = res.data;
      this.setState({ projects, projectsOriginal });
    });

    axios.get(`http://localhost:3000/data/categories.json`).then(res => {
      const categories = res.data;
      this.setState({ categories });
    });

    axios.get(`http://localhost:3000/data/skills.json`).then(res => {
      const skills = res.data;
      this.setState({ skills });
    });
  }

  changedElement(selected) {
    console.log(selected);
    if (selected.length > 0) {
      this.setState({
        projects: this.state.projectsOriginal.filter(project =>
          this.filterIt(selected, project)
        )
      });
    } else {
      this.setState({
        projects: this.state.projectsOriginal
      });
    }
  }

  filterIt(selected, project) {
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
