import React, { Component } from 'react';

class CardView extends Component {
    
    render() {
        return (
            <div>
                {this.props.projects.map(project =>
                    <div className="card-view" key={project.id}>
                        <figure>
                            <img src={project.img} alt="Avatar" style={{width: '100%'}} />
                        </figure>
                        <h2>{project.name}</h2>
                        <ul>
                            {project.features.map(feature => (
                                <li key={feature.id}>
                                    <label>
                                        <span>{feature.text}</span>
                                    </label>
                                </li>
                            ))}
                            <li><a href={project.dir}>open</a></li>
                        </ul>
                    </div>
                )
                }
            </div>
        )
    }
}
export default CardView;
