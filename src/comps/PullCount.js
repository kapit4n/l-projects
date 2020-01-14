import React, { Component } from "react";
import axios from "axios";
import env from '../env'

class PullCount extends Component {
  constructor(props) {
    super(props);
    this.state = { countData: 0 };
    if (env.pullData)
      axios
        .get(
          `https://api.github.com/repos/kapit4n/${props.projectName}/contributors`
        )
        .then(res => {
          if (res.data[0] && res.data[0].contributions) {
            const countData = res.data[0].contributions;
            this.setState({ countData });
          } else {
            this.setState({ countData: 0 });
          }
        });
  }
  render() {
    return <span>{this.state.countData}</span>;
  }
}
export default PullCount;
