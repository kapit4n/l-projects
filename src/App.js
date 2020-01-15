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
      selectedCats: [],
      selectedSkills: [],
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
    this.setState({ selectedCats: filters });
    const result = this.applyFilterCategories(filters, this.applyFilterSkills(this.state.selectedSkills, this.state.projectsOriginal));
    this.setState({ projects: result });
  }

  dropCategory(category) {
    const filters = [...this.state.selectedCats.filter(x => x.name !== category.name)];
    this.setState({ selectedCats: filters })
    const result = this.applyFilterCategories(filters, this.applyFilterSkills(this.state.selectedSkills, this.state.projectsOriginal));
    this.setState({ projects: result });

  }

  applyFilterCategories(filters, projectsOriginal) {
    let projects = projectsOriginal;
    if (filters.length > 0) {
      projects = projectsOriginal.filter(x => filters.find(y => x.categories.find(z => z.name === y.name)));
    }
    return projects;
  }

  applyFilterSkills(filters, projectsOriginal) {
    let projects = projectsOriginal;
    if (filters.length > 0) {
      projects = projectsOriginal.filter(x => filters.find(y => x.skills.find(z => z.name === y.name)));
    }
    this.setState({ selectedSkills: filters });
    return projects;
  }

  changedElement(selected) {
    this.setState({ selectedSkills: selected });
    const result = this.applyFilterCategories(this.state.selectedCats, this.applyFilterSkills(selected, this.state.projectsOriginal));
    this.setState({ projects: result });
  }

  render() {
    return (
      <div className="container">
        <div className="container-projects">
          <CategoryComp categories={this.state.categories}
            selectedCats={this.state.selectedCats}
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
