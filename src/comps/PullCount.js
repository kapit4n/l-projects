import React, { Component } from 'react';
import axios from 'axios';

class PullCount extends Component {
    constructor(props) {
        super(props);
        this.state = { countData: 0}
        axios.get(`https://api.github.com/repos/kapit4n/${props.projectName}/contributors`)
            .then(res => {
                const countData = res.data[0].contributions;
                this.setState({ countData });
            })
    }
    render() {
        return (
            <span>
                {this.state.countData}
            </span>
        )
    }
}
export default PullCount;
