import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import ProjectService from '../../services/ProjectsService';

import './Details.css'

export default function Details() {

  const { id } = useParams()
  const [project, setProject] = React.useState({})
  const service = new ProjectService()

  React.useEffect(() => {
    async function loadProject() {
      const projects = await service.getProjects()
      projects.data.forEach(function (project) {
        if (project.id == id) {
          setProject(project)
        }
      })
    }
    loadProject()
  }, [])

  return (
    <div>
      <Link to="/">List</Link>
      <h1>{project.name}</h1>
      <a href={`https://github.com/kapit4n/${project.name}`}>
        <img className="github-icon" src="https://w7.pngwing.com/pngs/914/758/png-transparent-github-social-media-computer-icons-logo-android-github-logo-computer-wallpaper-banner-thumbnail.png" />
      </a>
      <figure>
        <img className="img-rounded details-img"
          src={project.img}
          alt="Avatar"
        />
      </figure>
      <p className="description">
        {project.description}
      </p>
      <h3>Languages</h3>
      <ul>
        {project?.languages && Object.entries(project.languages).map((en) => (<li key={en[0]}>{en[0]}({en[1]})</li>))}
      </ul>
      <h3>Skills</h3>
      <ul>
        {project?.skills?.map(sk => (<li key={sk}>{sk}</li>))}
      </ul>
      <h3>Features</h3>
      <ul>
        {project?.features?.map(fch => (<li key={fch}>{fch}</li>))}
      </ul>
    </div>
  );
}