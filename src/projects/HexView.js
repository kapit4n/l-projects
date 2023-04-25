import React, { Component } from 'react';

import "./HexView.css"

class HexView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="hex-container">
                {this.props.projects.map(project =>
                    <div className="hex">
                        <div className="top"></div>
                        <div className="middle">
                            <h2>{project.name}</h2>
                            <ul>
                                {project.features.slice(0, 2).map(feature => (
                                    <li key={feature}>
                                        <label>
                                            <span>{feature}</span>
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
