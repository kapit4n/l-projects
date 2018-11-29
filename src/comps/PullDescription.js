import React, { Component } from "react";
import axios from "axios";

class PullDescription extends Component {
  constructor(props) {
    super(props);
    this.state = { description: "" };

    axios
      .get(`https://api.github.com/repos/kapit4n/${props.projectName}`)
      .then(res => {
        console.log(res);
        if (res.data && res.data.description) {
          const description = res.data.description;
          this.setState({ description });
        } else {
          this.setState({ description: "" });
        }
      });
  }
  render() {
    return <span>{this.state.description}</span>;
  }
}
export default PullDescription;
