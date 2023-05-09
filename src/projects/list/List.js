import React from 'react';
import { Link } from 'react-router-dom';

import HexView from '../viewMode/HexView'
import CardView from '../viewMode/ProjectCard'
import StatsView from '../viewMode/StatsView'
import SkillsComp from "./ProjectSkills";
import ProjectService from '../../services/ProjectsService'
import GithubService from '../../services/GithubService'

import './List.css'
import ProjectCategory from './ProjectCategory';
import ListActions from './ListActions';

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

        const topics = description.data.topics
        const language = description.data.language
        const size = description.data.size
        const openIssues = description.data.open_issues

        projects[i].description = resultDescription
        projects[i].startDate = createdAt
        projects[i].updatedDate = pushedAt

        projects[i].skills = topics
        projects[i].language = language
        projects[i].size = size
        projects[i].openIssues = openIssues

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

  const assignLanguages = (projects, allLanguages) => {
    for (let i = 0; i < allLanguages.length; i++) {
      const contribution = allLanguages[i]
      if (contribution.data) {
        const languages = contribution.data;
        projects[i].languages = languages
      }
    }
  }

  const buildFetchData = (projects) => {

    const projectsContributions = []
    const projectsDescription = []
    const projectsLanguages = []

    projects.forEach(p => {
      const fetchDescription = githubService.getDescriptions(p.name)
      const fetchContributions = githubService.getContributions(p.name)
      const fetchLanguages = githubService.getLanguages(p.name)
      projectsContributions.push(fetchContributions)
      projectsDescription.push(fetchDescription)
      projectsLanguages.push(fetchLanguages)
    })

    return { projectsDescription, projectsContributions, projectsLanguages }
  }

  const exportProjects = () => {

    let toExportProjects = [...projects]
    toExportProjects = [...toExportProjects.map(p => ({ ...p, languageKeys: p.languages ? Object.keys(p.languages) : [] }))]

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
      projects = projectsOriginal.filter(x => filters.find(y => x.languageKeys.find(z => z.toUpperCase().includes(y.toUpperCase()))));
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
    const categoriesSet = new Set(projects.map(p => {

      if (p.languageKeys) {
        return p.languageKeys
      }
      return []
    }).flat().map(cat => cat.toUpperCase()))
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
    const lastN = 1
    const fromN = 0
    const syncProjects = projects.slice(fromN, lastN)
    const { projectsContributions, projectsDescription, projectsLanguages } = buildFetchData(syncProjects)
    const resultAllContributions = Promise.all(projectsContributions)
    const resultAllDescription = Promise.all(projectsDescription)
    const resultAllLanguages = Promise.all(projectsLanguages)

    const allContributions = await resultAllContributions
    assignContributions(syncProjects, allContributions)

    const allDescriptions = await resultAllDescription
    assignDescriptions(syncProjects, allDescriptions)

    const allLanguages = await resultAllLanguages
    assignLanguages(syncProjects, allLanguages)

    const mergedProjects = [...syncProjects, ...projects.slice(fromN + lastN)]
    setProjects(mergedProjects)
  }

  const topTen = () => {
    const topTen = projectsOriginal.slice(0, 10)
    setProjects(topTen)
  }

  const moveUp = (project) => {
    const movedProjects = [project, ...projects.filter(p => p.id !== project.id)]
    setProjects(movedProjects)
  }

  return (
    <div className="container">
      <ProjectCategory {...{ categories, addCategory, dropCategory, selectedCats }} />
      <div>
        <SkillsComp skills={skills} changedElement={changedElement} />
      </div>
      <div>
        <ListActions {...{ setViewMode, exportProjects, sortAsc, sortDesc, syncGithub, totalProjects, totalCommits, topTen }} />
        <div className="projects-list-totals">
          <Link to="/add">Add</Link>
        </div>
        {viewMode === 'card' && (
          <CardView projects={projects} moveUp={moveUp} />
        )}
        {viewMode === 'hex' && (
          <HexView projects={projects} />
        )}
        {viewMode === 'stats' && (
          <StatsView projects={projects} />
        )}
      </div>
    </div >
  )
}

