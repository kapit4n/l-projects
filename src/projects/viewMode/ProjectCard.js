import React, { Component } from "react";
import { Link } from "react-router-dom";
import Chip from "../../components/Chip";
import DateFromNow from "../../components/DateFromNow";

import './ProjectCard.css'

class ProjectCard extends Component {
  renderFeature(feature) {
    return (
      <label>
        <span style={{ color: "#b3c6ff" }}>{feature}</span>
      </label>
    );
  }

  render() {
    return (
      <div className="project-list-card">
        {this.props.projects.map(project => (
          <div className="card-view" key={project.projectName}>
            <figure style={{ width: '100%', height: '200px' }}>
              <Link to={`details/${project.id}`}
              >
                <img
                  className="img-rounded"
                  src={project.img}
                  alt="Avatar"
                  style={{ objectFit: 'fill', width: '100%' }}
                />
              </Link>
            </figure>
            <h3>
              {project.name} ({project.contributions}) <button className="move-up" onClick={() => this.props.moveUp(project)}>Up</button> <a href={project.dir}>github</a>
            </h3>
            <div className="chips-container">
              {project.languageKeys.map(cat => (
                <span className="chip-category">{cat}</span>
              ))}
              {project.skills.map(ski => (
                <Chip value={ski} />
              ))}
            </div>
            <br />
            Created At: <DateFromNow date={project.startDate} />
            <p>
              {project.description}
              <br />
              Last Updated At: <DateFromNow date={project.updatedDate} />
            </p>
            <ul>
              {project.features.slice(0, 2).map(feature => (
                <li key={feature}>{this.renderFeature(feature)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}
export default ProjectCard;
