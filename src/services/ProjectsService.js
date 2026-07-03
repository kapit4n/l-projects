import axios from 'axios'
import env from '../env'

export default class ProjectService {

  constructor() {
    this.url = `${process.env.REACT_APP_API_URL}/projects`
  }

  getProjects() {
    return axios.get(this.getUrl())
  }

  getUrl() {
    if (env.pullData) {
      return 'http://localhost:8000/projects'
    }
    return `/data/projects-all.json`
  }
}
