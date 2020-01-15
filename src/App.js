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
      skills: [],
      selectedCats: []
    };
    this.changedElement = this.changedElement.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.dropCategory = this.dropCategory.bind(this);
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
      const projectsOriginal = res.data.slice();
      this.setState({ skills });
    });
  }

  addCategory(category) {
    const filters = [...this.state.selectedCats, category];
    this.setState({ selectedCats: filters })
    this.applyFilters(filters);
  }

  dropCategory(category) {
    const filters = [...this.state.selectedCats.filter(x => x.name !== category.name)];
    this.setState({ selectedCats: filters })
    this.applyFilters(filters);
  }

  applyFilters(filters) {
    let projects = this.state.projectsOriginal;
    if (filters.length > 0) {
      projects = this.state.projectsOriginal.filter(x => filters.find(y => x.categories.find(z => z.name === y.name)));
    }
    this.setState({ projects })
  }

  changedElement(selected) {
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
      this.setState({
        projects: []
      });
      this.setState({
        projects
      });
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
          <CategoryComp categories={this.state.categories} selectedCats={this.state.selectedCats}
            addCategory={this.addCategory}
            dropCategory={this.dropCategory}
          />
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
