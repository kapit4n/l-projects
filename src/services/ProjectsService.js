import axios from 'axios'

export default class ProjectService {

  constructor() {
    this.url = `${process.env.REACT_APP_API_URL}/projects`
  }

  getProjects() {
    return axios.get(this.getUrl())
  }

  getUrl() {
    if (process.env.REACT_APP_IS_MOCKED) {
      return `/data/projects-all.json`
    }
    return `${process.env.REACT_APP_API_URL}/projects`
  }
}
