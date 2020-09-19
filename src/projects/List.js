import React from 'react';
import axios from "axios";

import CardView from '../comps/CardView'
import SkillsComp from "../comps/SkillsComp";

export default function List() {

  const [projects, setProjects] = React.useState([]);
  const [projectsOriginal, setProjectsOriginal] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [skills, setSkills] = React.useState([]);
  const [selectedCats, setSelectedCats] = React.useState([]);
  const [selectedSkills, setSelectedSkills] = React.useState([]);

  React.useEffect(() => {
    axios.get(`/data/projects.json`).then(res => {
      const projects = res.data.slice();
      const projectsOriginal = res.data.slice();
      setProjects(projects)
      setProjectsOriginal(projectsOriginal);
    });

    axios.get(`/data/categories.json`).then(res => {
      const categories = res.data;
      setCategories(categories);
    });

    axios.get(`/data/skills.json`).then(res => {
      const skills = res.data;
      setSkills(skills);
    });

  }, [])

  const addCategory = (category) => {
    const filters = [...selectedCats, category];
    setSelectedCats(filters);
    const result = applyFilterCategories(filters, applyFilterSkills(selectedSkills, projectsOriginal));
    setProjects(result);
  }

  const dropCategory = (category) => {
    const filters = [...selectedCats.filter(x => x.name !== category.name)];
    setSelectedCats(filters)
    const result = applyFilterCategories(filters, applyFilterSkills(selectedSkills, projectsOriginal));
    setProjects(result);

  }

  const applyFilterCategories = (filters, projectsOriginal) => {
    let projects = projectsOriginal;
    if (filters.length > 0) {
      projects = projectsOriginal.filter(x => filters.find(y => x.categories.find(z => z.name === y.name)));
    }
    return projects;
  }

  const applyFilterSkills = (filters, projectsOriginal) => {
    let projects = projectsOriginal;
    if (filters.length > 0) {
      projects = projectsOriginal.filter(x => filters.find(y => x.skills.find(z => z.name === y.name)));
    }
    setSelectedSkills(filters);
    return projects;
  }

  const changedElement = (selected) => {
    setSelectedSkills(selected);
    const result = applyFilterCategories(selectedCats, applyFilterSkills(selected, projectsOriginal));
    setProjects(result);
  }

  return (
    <div>
      {categories.map(category => {
        if (selectedCats.find(cat => cat.name === category.name)) {
          return <button style={{ background: 'green' }} className="category-view" key={category.id}
            onClick={() => dropCategory(category)} >
            {category.name}
          </button>
        } else {
          return <button className="category-view" key={category.id}
            onClick={() => addCategory(category)}>
            {category.name}
          </button>
        }
      }
      )
      }

      <SkillsComp
        skills={skills}
        changedElement={changedElement}
      />


      <CardView projects={projects} />
    </div>
  )
}

