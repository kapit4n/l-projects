import React, { Component } from "react";
import PullCount from "./PullCount";
import PullDescription from "./PullDescription";
import MomentProject from "./MomentProject";

class CardView extends Component {
  renderInputField(feature) {
    if (feature.done) {
      return (
        <label>
          <span style={{ color: "#b3c6ff" }}>{feature.text}</span>
        </label>
      );
    } else {
      return (
        <label>
          <span>{feature.text}</span>
        </label>
      );
    }
  }

  render() {
    return (
      <div>
        {this.props.projects.map(project => (
          <div className="card-view" key={project.id}>
            <figure style={{width: '100%', height: '200px'}}>
              <img
                className="img-rounded"
                src={project.img}
                alt="Avatar"
                style={{ objectFit: 'fill', width: '100%' }}
              />
            </figure>
            <h3>
              {project.name} (<PullCount projectName={project.name} />)
            </h3>
            {project.categories.map(cat => (
              <span className="chip-category">{cat.name}</span>
            ))}
            {project.skills.map(ski => (
              <span className="chip-skill">{ski.name}</span>
            ))}
            <br />
            <MomentProject momDate={project.startDate} />,{" "}
            <a href={project.dir}>Open</a>
            <p>
              <PullDescription projectName={project.name} />
            </p>
            <ul>
              {project.features.map(feature => (
                <li key={feature.id}>{this.renderInputField(feature)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}
export default CardView;
