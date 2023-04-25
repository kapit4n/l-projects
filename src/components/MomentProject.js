import React from 'react';
import moment from 'moment';

const MomentProject = (props) => {
    return (
        <span>
            {moment(new Date(props.momDate)).fromNow()}
        </span>
    )
}
export default MomentProject;
