import axios from 'axios'

export default class SkillService {

  constructor() {
    if (process.env.REACT_APP_IS_MOCKED) {
      this.url = `/data/skills.json`
    } else {
      this.url = `${process.env.REACT_APP_API_URL}/skills`
    }
  }

  getSkills() {
    return axios.get(this.url)
  }
}
