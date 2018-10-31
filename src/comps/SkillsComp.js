import React, { Component, Fragment }  from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import 'react-bootstrap-typeahead/css/Typeahead.css';

class SkillsComp extends Component {
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
                    options={this.props.skills}
                    placeholder="Choose a state..."
                />
                
            </Fragment>
        );
    }
}

export default SkillsComp;
