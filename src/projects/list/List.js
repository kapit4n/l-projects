import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProjectService from '../../services/ProjectsService';
import GithubService from '../../services/GithubService';

import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterChips from '../../components/FilterChips/FilterChips';
import StatsCards from '../../components/StatsCards/StatsCards';
import Toolbar from '../../components/Toolbar/Toolbar';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import HexView from '../viewMode/HexView';
import StatsView from '../viewMode/StatsView';

import './List.css';

const SKELETON_COUNT = 6;

function applyFilterCategories(filters, projects) {
  if (filters.length === 0) return projects;
  return projects.filter((x) =>
    filters.find((y) =>
      (x.languageKeys || []).find(
        (z) => z.toUpperCase().includes(y.toUpperCase())
      )
    )
  );
}

function applyFilterSkills(filters, projects) {
  if (filters.length === 0) return projects;
  return projects.filter((x) =>
    filters.find((y) =>
      (x.skills || []).find((z) => z.toUpperCase().includes(y.toUpperCase()))
    )
  );
}

export default function List() {
  const [projects, setProjects] = useState([]);
  const [projectsOriginal, setProjectsOriginal] = useState([]);
  const [viewMode, setViewMode] = useState('card');
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const projectService = useMemo(() => new ProjectService(), []);
  const githubService = useMemo(() => new GithubService(), []);

  const totalProjects = projects.length;
  const totalCommits = useMemo(
    () => projects.reduce((prev, curr) => prev + (curr.contributions || 0), 0),
    [projects]
  );

  const assignDescriptions = useCallback((projects, allDescriptions) => {
    for (let i = 0; i < allDescriptions.length; i++) {
      const desc = allDescriptions[i];
      if (desc.data && desc.data.description) {
        projects[i].description = desc.data.description;
        projects[i].startDate = desc.data.created_at;
        projects[i].updatedDate = desc.data.pushed_at;
        projects[i].skills = desc.data.topics;
        projects[i].language = desc.data.language;
        projects[i].size = desc.data.size;
        projects[i].openIssues = desc.data.open_issues;
      }
    }
  }, []);

  const assignContributions = useCallback((projects, allContributions) => {
    for (let i = 0; i < allContributions.length; i++) {
      const contrib = allContributions[i];
      if (contrib.data[0] && contrib.data[0].contributions) {
        projects[i].contributions = contrib.data[0].contributions;
      }
    }
  }, []);

  const assignLanguages = useCallback((projects, allLanguages) => {
    for (let i = 0; i < allLanguages.length; i++) {
      const lang = allLanguages[i];
      if (lang.data) {
        projects[i].languages = lang.data;
      }
    }
  }, []);

  const buildFetchData = useCallback(
    (projects) => {
      const projectsContributions = [];
      const projectsDescription = [];
      const projectsLanguages = [];

      projects.forEach((p) => {
        projectsContributions.push(githubService.getContributions(p.name));
        projectsDescription.push(githubService.getDescriptions(p.name));
        projectsLanguages.push(githubService.getLanguages(p.name));
      });

      return {
        projectsContributions,
        projectsDescription,
        projectsLanguages,
      };
    },
    [githubService]
  );

  const exportProjects = useCallback(() => {
    const toExport = projects.map((p) => ({
      ...p,
      languageKeys: p.languages ? Object.keys(p.languages) : [],
    }));
    const json = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(toExport)
    )}`;
    const link = document.createElement('a');
    link.href = json;
    link.download = 'projects.json';
    link.click();
  }, [projects]);

  const addCategory = useCallback(
    (category) => {
      const filters = [...selectedCats, category];
      setSelectedCats(filters);
      const result = applyFilterCategories(
        filters,
        applyFilterSkills([], projectsOriginal)
      );
      setProjects(result);
    },
    [selectedCats, projectsOriginal]
  );

  const dropCategory = useCallback(
    (category) => {
      const filters = selectedCats.filter((x) => x !== category);
      setSelectedCats(filters);
      const result = applyFilterCategories(filters, projectsOriginal);
      setProjects(result);
    },
    [selectedCats, projectsOriginal]
  );

  const sortAsc = useCallback(() => {
    setProjects((prev) =>
      [...prev].sort(
        (a, b) => new Date(b.updatedDate) - new Date(a.updatedDate)
      )
    );
  }, []);

  const sortDesc = useCallback(() => {
    setProjects((prev) =>
      [...prev].sort(
        (a, b) => new Date(a.updatedDate) - new Date(b.updatedDate)
      )
    );
  }, []);

  const loadFilters = useCallback((projects) => {
    const categoriesSet = new Set(
      projects
        .map((p) => (p.languageKeys ? p.languageKeys : []))
        .flat()
        .map((cat) => cat.toUpperCase())
    );
    const skillsSet = new Set(
      projects
        .map((p) => p.skills)
        .flat()
        .map((fet) => fet.toUpperCase())
    );
    setCategories([...categoriesSet]);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await projectService.getProjects();
        const startSlice = 0;
        const size = startSlice + 10 + 6 + 10 + 10;
        const data = res.data.slice(startSlice, size);
        setProjects(data);
        setProjectsOriginal(data);
        loadFilters(data);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projectService, loadFilters]);

  const syncGithub = useCallback(async () => {
    const lastN = 1;
    const fromN = 0;
    const syncProjects = projects.slice(fromN, lastN);
    const { projectsContributions, projectsDescription, projectsLanguages } =
      buildFetchData(syncProjects);

    const [allContributions, allDescriptions, allLanguages] =
      await Promise.all([
        Promise.all(projectsContributions),
        Promise.all(projectsDescription),
        Promise.all(projectsLanguages),
      ]);

    assignContributions(syncProjects, allContributions);
    assignDescriptions(syncProjects, allDescriptions);
    assignLanguages(syncProjects, allLanguages);

    setProjects([...syncProjects, ...projects.slice(fromN + lastN)]);
  }, [projects, buildFetchData, assignContributions, assignDescriptions, assignLanguages]);

  const topTen = useCallback(() => {
    setProjects(projectsOriginal.slice(0, 10));
  }, [projectsOriginal]);

  const moveUp = useCallback((project) => {
    setProjects((prev) => [project, ...prev.filter((p) => p.id !== project.id)]);
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.skills || []).some((s) => s.toLowerCase().includes(q)) ||
        (p.languageKeys || []).some((l) => l.toLowerCase().includes(q))
    );
  }, [projects, searchQuery]);

  return (
    <div className="dashboard">
      <DashboardHeader totalProjects={totalProjects} />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className="dashboard-filters-row">
        <FilterChips
          categories={categories}
          selectedCats={selectedCats}
          onAdd={addCategory}
          onDrop={dropCategory}
        />
      </div>

      <StatsCards
        totalProjects={totalProjects}
        totalCommits={totalCommits}
      />

      <Toolbar
        onExport={exportProjects}
        onSortAsc={sortAsc}
        onSortDesc={sortDesc}
        onSetView={setViewMode}
        onSync={syncGithub}
        onTopTen={topTen}
        currentView={viewMode}
      />

      {loading ? (
        <div className="project-grid">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={
            searchQuery
              ? 'Try adjusting your search or filters.'
              : 'Create your first project to get started.'
          }
          actionLabel="Add Project"
          actionLink="/add"
        />
      ) : (
        <>
          {viewMode === 'card' && (
            <ProjectCard projects={filteredProjects} onMoveUp={moveUp} />
          )}
          {viewMode === 'hex' && <HexView projects={filteredProjects} />}
          {viewMode === 'stats' && <StatsView projects={filteredProjects} />}
        </>
      )}
    </div>
  );
}
