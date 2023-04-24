import axios from 'axios'

export default class CategoryService {

  constructor() {
    if (process.env.REACT_APP_IS_MOCKED) {
      this.url = `/data/categories.json`
    } else {
      this.url = `${process.env.REACT_APP_API_URL}/categories`
    }
  }

  getCategories() {
    return axios.get(this.url)
  }
}
