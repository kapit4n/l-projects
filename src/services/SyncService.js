import axios from 'axios'

export default class SyncService {
  constructor() {
    this.baseUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}`
  }

  getUrl() {
    if (process.env.REACT_APP_IS_MOCKED) {
      return null
    }
    return this.baseUrl
  }

  async getAllCommits() {
    const url = this.getUrl()
    if (!url) return []
    const res = await axios.get(`${url}/commits/`)
    return res.data
  }

  async saveCommit(projectName, totalCommits) {
    const url = this.getUrl()
    if (!url) return
    await axios.post(`${url}/commits/`, { project_name: projectName, total_commits: totalCommits })
  }

  async saveCommitsBatch(commits) {
    const url = this.getUrl()
    if (!url) return
    await axios.post(`${url}/commits/batch`, commits)
  }
}
