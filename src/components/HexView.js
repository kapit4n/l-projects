import React, { Component } from 'react';

class HexView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                {this.props.projects.map(project =>
                    <div className="hex">
                        <div className="top"></div>
                        <div className="middle">
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
                        <div className="bottom"></div>
                    </div>
                )
                }
            </div>
        )
    }
}
export default HexView;
