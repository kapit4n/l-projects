import React from 'react';
import axios from 'axios'

import CardView from '../components/ProjectCard'
import SkillsComp from "../components/SkillsComp";
import ProjectService from '../services/projects-service'
import CategoriesService from '../services/categories-service'
import SkillsService from '../services/skills-service'

import './List.css'

export default function List() {

  // move project to another place
  const [projects, setProjects] = React.useState([]);
  const [projectsOriginal, setProjectsOriginal] = React.useState([]);
  const projectService = new ProjectService()

  const [categories, setCategories] = React.useState([]);
  const [selectedCats, setSelectedCats] = React.useState([]);
  const categoriesService = new CategoriesService()

  const [skills, setSkills] = React.useState([]);
  const [selectedSkills, setSelectedSkills] = React.useState([]);
  const skillsService = new SkillsService()

  const totalProjects = React.useMemo(() => {
    return projects.length
  }, [projects])

  const totalCommits = React.useMemo(() => {
    return projects.length
  }, [projects])

  React.useEffect(async () => {
    const res = await projectService.getProjects()
    const size = 1
    const projects = res.data.slice(0, size);
    const projectsOriginal = res.data.slice(0, size);

    // make another call for all the projects with PromiseAll

    const pullData = false
    if (pullData) {
      const projectsContributions = []
      const projectsDescription = []
      const projectsCommits = []

      projects.forEach(p => {
        const fetchDescription = axios.get(`https://api.github.com/repos/kapit4n/${p.name}`)
        const fetchContributions = axios.get(`https://api.github.com/repos/kapit4n/${p.name}/contributors`)
        projectsContributions.push(fetchContributions)
        projectsDescription.push(fetchDescription)
      })

      const resultAllContributions = Promise.all(projectsContributions)
      const resultAllDescription = Promise.all(projectsDescription)
      
      const allContributions = await resultAllContributions
      for (let i = 0; i < allContributions.length; i++) {
        const contribution = allContributions[i]
        if (contribution.data[0] && contribution.data[0].contributions) {
          const countData = contribution.data[0].contributions;
          projects[i].contributions = countData
        }
      }
      
      const allDescriptions = await resultAllDescription
      for (let i = 0; i < allDescriptions.length; i++) {
        const description = allDescriptions[i]
        if (description.data && description.data.description) {
          const resultDescription = description.data.description;
          const pushedAt = description.data.pushed_at;
          const createdAt = description.data.created_at
          projects[i].description = resultDescription
          projects[i].startDate = createdAt
          projects[i].updatedDate = pushedAt
        }
      }
    }

    setProjects(projects)
    setProjectsOriginal(projectsOriginal);

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
      projects = projectsOriginal.filter(x => filters.find(y => x.categories.find(z => z.name.toLowerCase().includes(y.name.toLowerCase()))));
    }
    return projects;
  }

  const applyFilterSkills = (filters, projectsOriginal) => {
    let projects = projectsOriginal;
    if (filters.length > 0) {
      projects = projectsOriginal.filter(x => filters.find(y => x.skills.find(z => z.name.toLowerCase().includes(y.name.toLowerCase()))));
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
              {category.name}XX
            </button>
          } else {
            return <button className="category-button-selected" key={category.id}
              onClick={() => addCategory(category)}>
              {category.name}YY
            </button>
          }
        })
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

