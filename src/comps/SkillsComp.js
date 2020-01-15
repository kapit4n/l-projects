import React, { Component, Fragment } from "react";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import "react-bootstrap-typeahead/css/Typeahead.css";

class SkillsComp extends Component {
  state = {
    multiple: true
  };

  render() {
    const { multiple } = this.state;

    return (
      <div style={{ padding: '1rem 2rem', display: 'inline-flex' }}>
        <Typeahead
          labelKey="name"
          multiple={multiple}
          options={this.props.skills}
          placeholder="Choose a skill..."
          onChange={this.props.changedElement}
        />
      </div>
    );
  }
}

export default SkillsComp;
