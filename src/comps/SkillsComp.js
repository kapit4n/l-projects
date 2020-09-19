import React, { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import "react-bootstrap-typeahead/css/Typeahead.css";

class SkillsComp extends Component {
  state = {
    multiple: true
  };

  render() {
    const { multiple } = this.state;

    return (
      <div style={{ width: '100%', margin: '1rem 0' }}>
        <Typeahead
          labelKey="name"
          multiple={multiple}
          options={this.props.skills}
          placeholder="Choose a skill..."
          onChange={this.props.changedElement}
          style={{ width: '100%' }}
        />
      </div>
    );
  }
}

export default SkillsComp;
