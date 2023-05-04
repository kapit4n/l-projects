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

    return () => {
      console.log("This will be logged on unount")
    }
  },
    [])

  return (
    <div>
      <Link to="/">List</Link>
      <h1>{project.name}</h1>
      <figure style={{ width: '400px' }}>
        <img
          className="img-rounded"
          src={project.img}
          alt="Avatar"
          style={{ objectFit: 'fill', width: '100%' }}
        />
      </figure>
      <p className="description">
        {project.description}
      </p>
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