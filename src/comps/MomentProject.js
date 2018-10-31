import React, { Component } from 'react';
import moment from 'moment';

class MomentProject extends Component {
    constructor(props) {
        super(props);
        const momDate = moment(props.momDate, "YYYY-MM-DD").fromNow();;
        this.state = { momDate }
    }
    render() {
        return (
            <span>
                {this.state.momDate}
            </span>
        )
    }
}
export default MomentProject;
