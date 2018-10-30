import React, { Component } from 'react';
import PullCount from './PullCount'
import MomentProject from './MomentProject'

class CardView extends Component {
    
    render() {
        return (
            <div>
                {this.props.projects.map(project =>
                    <div className="card-view" key={project.id}>
                        <figure>
                            <img className="img-rounded" src={project.img} alt="Avatar" style={{width: '100%'}} />
                        </figure>
                        <h3>{project.name} (<PullCount projectName={project.name}></PullCount>)</h3>
                        <MomentProject momDate={project.startDate}></MomentProject>   
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
