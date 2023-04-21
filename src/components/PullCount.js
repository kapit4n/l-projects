import React, { Component } from "react";
import axios from "axios";
import env from '../env'

class PullCount extends Component {
  constructor(props) {
    super(props);
    this.state = { countData: 0 };
  }
  render() {
    return <span>{this.state.countData}</span>;
  }
}
export default PullCount;
