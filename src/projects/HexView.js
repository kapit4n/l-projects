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
                            <h4><a href={project.dir}> {project.name.slice(0, 10)}({project.contributions}) </a></h4>
                            <ul>
                                {project.features.slice(0, 3).map(feature => (
                                    <li key={feature}>
                                        <span>{feature}</span> 
                                    </li>
                                ))}
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
