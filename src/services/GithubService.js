import axios from 'axios'

export default class GithubService {


  constructor() {
    if (process.env.REACT_APP_IS_MOCKED === 'true') {
      this.url = ``
    } else {
      this.url = `https://api.github.com/repos/kapit4n`
    }
  }

  getDescriptions(projectName) {
    return axios.get(`${this.url}/${projectName}`)
  }

  getContributions(projectName) {
    return axios.get(`https://api.github.com/repos/kapit4n/${projectName}/contributors`)
  }
}
