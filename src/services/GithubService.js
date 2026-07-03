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

  getLanguages(projectName) {
    return axios.get(`https://api.github.com/repos/kapit4n/${projectName}/languages`)
  }
  
  getCommits(projectName) {
    return axios.get(`https://api.github.com/repos/kapit4n/${projectName}/commits`)
  }

  getReadme(projectName) {
    return axios.get(`https://api.github.com/repos/kapit4n/${projectName}/readme`)
  }

  getTopCommits(projectName, count = 5) {
    return axios.get(
      `https://api.github.com/repos/kapit4n/${projectName}/commits?per_page=${count}`
    )
  }

  getRepoContents(projectName, path = '') {
    return axios.get(
      `https://api.github.com/repos/kapit4n/${projectName}/contents/${path}`
    )
  }

  async getTotalCommits(projectName) {
    if (process.env.REACT_APP_IS_MOCKED === 'true') {
      return Math.floor(Math.random() * 500) + 50
    }
    try {
      const res = await axios.get(
        `https://api.github.com/repos/kapit4n/${projectName}/commits?per_page=1`,
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      )
      const link = res.headers['link']
      if (!link) {
        if (Array.isArray(res.data)) return res.data.length
        return 0
      }
      const match = link.match(/page=(\d+)>; rel="last"/)
      if (match) return parseInt(match[1], 10)
      return res.data.length
    } catch {
      return 0
    }
  }
}
