import React, { Component, Fragment }  from 'react';
import { FormGroup } from 'react-bootstrap';
import Control from './Control'
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import 'react-bootstrap-typeahead/css/Typeahead.css';

class SkillsComp extends React.Component {
    state = {
        multiple: true,
    };

    render() {
        const { multiple } = this.state;

        return (
            <Fragment>
                <Typeahead
                    labelKey="name"
                    multiple={multiple}
                    options={["java", "javascript", "vue"]}
                    placeholder="Choose a state..."
                />
                
            </Fragment>
        );
    }
}

export default SkillsComp;
