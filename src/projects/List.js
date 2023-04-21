import React from 'react';
import axios from "axios";

import CardView from '../components/CardView'
import SkillsComp from "../components/SkillsComp";
import ProjectService from '../services/projects-service'
import CategoriesService from '../services/categories-service'
import SkillsService from '../services/skills-service'

import './List.css'

export default function List() {

  const [projects, setProjects] = React.useState([]);
  const [projectsOriginal, setProjectsOriginal] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [skills, setSkills] = React.useState([]);
  const [selectedCats, setSelectedCats] = React.useState([]);
  const [selectedSkills, setSelectedSkills] = React.useState([]);
  const projectService = new ProjectService()
  const categoriesService = new CategoriesService()
  const skillsService = new SkillsService()

  const totalProjects = React.useMemo(() => {
    return projects.length
  }, [projects])

  const totalCommits = React.useMemo(() => {
    return projects.length
  }, [projects])

  React.useEffect(() => {
    projectService.getProjects().then(res => {
      const projects = res.data.slice();
      const projectsOriginal = res.data.slice();
      setProjects(projects)
      setProjectsOriginal(projectsOriginal);
    });

    categoriesService.getCategories().then(res => {
      const categories = res.data;
      setCategories(categories);
    });

    skillsService.getSkills().then(res => {
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
    <div className="container">
      <div className='category-view'>
        {categories.map(category => {
          if (selectedCats.find(cat => cat.name === category.name)) {
            return <button className="category-button" key={category.id}
              onClick={() => dropCategory(category)} >
              {category.name}
            </button>
          } else {
            return <button className="category-button-selected" key={category.id}
              onClick={() => addCategory(category)}>
              {category.name}
            </button>
          }
        }
        )
        }
      </div>
      <div>
        <SkillsComp
          skills={skills}
          changedElement={changedElement}
        />
      </div>

      <div>
        <div className="projects-list-totals">
          <span>Total Projects: {totalProjects}</span>
          <span>Total commits: {totalCommits}</span>
        </div>
        <CardView projects={projects} />
      </div>
    </div>
  )
}

