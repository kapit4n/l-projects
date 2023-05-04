import React from 'react';
import { Link } from 'react-router-dom';

import HexView from './HexView'
import CardView from './ProjectCard'
import StatsView from './StatsView'
import SkillsComp from "./ProjectSkills";
import ProjectService from '../services/ProjectsService'
import GithubService from '../services/GithubService'

import './List.css'
import ProjectCategory from './ProjectCategory';

export default function List() {

  // move project to another place
  const [projects, setProjects] = React.useState([]);
  const [viewMode, setViewMode] = React.useState("card")
  const [projectsOriginal, setProjectsOriginal] = React.useState([]);
  const projectService = new ProjectService()

  const [categories, setCategories] = React.useState([]);
  const [selectedCats, setSelectedCats] = React.useState([]);

  const [skills, setSkills] = React.useState([]);
  const [selectedSkills, setSelectedSkills] = React.useState([]);
  const githubService = new GithubService()

  const totalProjects = React.useMemo(() => {
    return projects.length
  }, [projects])

  const totalCommits = React.useMemo(() => {
    return projects.reduce((prev, curr) => prev + curr.contributions, 0)
  }, [projects])

  const assignDescriptions = (projects, allDescriptions) => {
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

  const assignContributions = (projects, allContributions) => {
    for (let i = 0; i < allContributions.length; i++) {
      const contribution = allContributions[i]
      if (contribution.data[0] && contribution.data[0].contributions) {
        const countData = contribution.data[0].contributions;
        projects[i].contributions = countData
      }
    }
  }

  const buildFetchData = (projects) => {

    const projectsContributions = []
    const projectsDescription = []

    projects.forEach(p => {
      const fetchDescription = githubService.getDescriptions(p.name)
      const fetchContributions = githubService.getContributions(p.name)
      projectsContributions.push(fetchContributions)
      projectsDescription.push(fetchDescription)
    })

    return { projectsDescription, projectsContributions }
  }

  const exportProjects = () => {

    let toExportProjects = [...projects]

    const jsonProjects = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(toExportProjects)
    )}`

    const link = document.createElement("a")
    link.href = jsonProjects
    link.download = "projects.json"

    link.click()
  }

  const addCategory = (category) => {
    const filters = [...selectedCats, category];
    setSelectedCats(filters);
    const result = applyFilterCategories(filters, applyFilterSkills(selectedSkills, projectsOriginal));
    setProjects(result);
  }

  const dropCategory = (category) => {
    const filters = [...selectedCats.filter(x => x !== category)];
    setSelectedCats(filters)
    const result = applyFilterCategories(filters, applyFilterSkills(selectedSkills, projectsOriginal));
    setProjects(result);
  }

  const applyFilterCategories = (filters, projectsOriginal) => {
    let projects = projectsOriginal;
    if (filters.length > 0) {
      projects = projectsOriginal.filter(x => filters.find(y => x.categories.find(z => z.toUpperCase().includes(y.toUpperCase()))));
    }
    return projects;
  }

  const applyFilterSkills = (filters, projectsOriginal) => {
    let projects = projectsOriginal;
    if (filters.length > 0) {
      projects = projectsOriginal.filter(x => filters.find(y => x.skills.find(z => z.toUpperCase().includes(y.toUpperCase()))));
    }
    setSelectedSkills(filters);
    return projects;
  }

  const changedElement = (selected) => {
    setSelectedSkills(selected);
    const result = applyFilterCategories(selectedCats, applyFilterSkills(selected, projectsOriginal));
    setProjects(result);
  }

  const sortAsc = () => {
    const sortedProjects = [...projects]
    sortedProjects.sort((a, b) => new Date(b.updatedDate) > new Date(a.updatedDate) ? -1 : 1)
    setProjects(sortedProjects)
  }

  const sortDesc = () => {
    const sortedProjects = [...projects]
    sortedProjects.sort((a, b) => new Date(a.updatedDate) > new Date(b.updatedDate) ? -1 : 1)
    setProjects(sortedProjects)
  }

  const loadFilters = (projects) => {
    const categoriesSet = new Set(projects.map(p => p.categories).flat().map(cat => cat.toUpperCase()))
    const skillsSet = new Set(projects.map(p => p.skills).flat().map(fet => fet.toUpperCase()))
    setCategories([...categoriesSet])
    setSkills([...skillsSet])
  }

  React.useEffect(() => {
    async function fetchData() {
      const res = await projectService.getProjects()
      const startSlice = 0
      const size = startSlice + 10 + 6 + 10 + 10
      const projects = res.data.slice(startSlice, size);
      const projectsOriginal = res.data.slice(startSlice, size);
      setProjects(projects)
      setProjectsOriginal(projectsOriginal)
      loadFilters(projects)
    }

    fetchData()
  }, [])

  const syncGithub = async () => {
    const lastN = 10
    const fromN = 0
    const syncProjects = projects.slice(fromN, lastN)
    const { projectsContributions, projectsDescription } = buildFetchData(syncProjects)
    const resultAllContributions = Promise.all(projectsContributions)
    const resultAllDescription = Promise.all(projectsDescription)

    const allContributions = await resultAllContributions
    assignContributions(syncProjects, allContributions)

    const allDescriptions = await resultAllDescription
    assignDescriptions(syncProjects, allDescriptions)
    const mergedProjects = [...syncProjects, ...projects.slice(fromN + lastN)]
    setProjects(mergedProjects)
  }

  return (
    <div className="container">
      <ProjectCategory {...{ categories, addCategory, dropCategory, selectedCats }} />
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
          <button onClick={exportProjects}>Export</button>
          <button onClick={sortAsc}>Asc</button>
          <button onClick={sortDesc}>Desc</button>
          <button onClick={() => setViewMode("card")}>CardView</button>
          <button onClick={() => setViewMode("hex")}>HexView</button>
          <button onClick={() => setViewMode("stats")}>Stats</button>
          <button onClick={syncGithub}>Sync</button>
        </div>
        <div className="projects-list-totals">
          <Link to="/add">Add</Link>
        </div>
        {viewMode === 'card' && (
          <CardView projects={projects} />
        )}
        {viewMode === 'hex' && (
          <HexView projects={projects} />
        )}
        {viewMode === 'stats' && (
          <StatsView projects={projects} />
        )}
      </div>
    </div>
  )
}

