import React, { Component } from "react";
import MomentProject from "./MomentProject";

class CardView extends Component {
  renderInputField(feature) {
    return (
      <label>
        <span style={{ color: "#b3c6ff" }}>{feature}</span>
      </label>
    );
  }

  render() {
    return (
      <div>
        {this.props.projects.map(project => (
          <div className="card-view" style={{ margin: '1rem' }} key={project.projectName}>
            <figure style={{ width: '100%', height: '200px' }}>
              <img
                className="img-rounded"
                src={project.img}
                alt="Avatar"
                style={{ objectFit: 'fill', width: '100%' }}
              />
            </figure>
            <h3>
              {project.name} ({project.contributions})
            </h3>
            {project.categories.slice(0, 2).map(cat => (
              <span className="chip-category">{cat}</span>
            ))}
            {project.skills.slice(0, 2).map(ski => (
              <span className="chip-skill">{ski}</span>
            ))}
            <br />
            Created At: <MomentProject momDate={project.startDate} />
            <a href={project.dir}>Open</a>
            <p>
              {project.description}
              Last Updated At: <MomentProject momDate={project.updatedDate} />
            </p>
            <ul>
              {project.features.slice(0, 2).map(feature => (
                <li key={feature}>{this.renderInputField(feature)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}
export default CardView;
