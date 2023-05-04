import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import ProjectService from '../services/ProjectsService';

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
      <h1>{project.name}</h1>
      <Link to="/">List</Link>
      <figure style={{ width: '400px', height: '400px' }}>
        <img
          className="img-rounded"
          src={project.img}
          alt="Avatar"
          style={{ objectFit: 'fill', width: '100%' }}
        />
      </figure>
    </div>
  );
}