import React from 'react';
import moment from 'moment';

const MomentProject = ({ date }) => {
    return (
        <span>
            {moment(new Date(date)).fromNow()}
        </span>
    )
}
export default MomentProject;
