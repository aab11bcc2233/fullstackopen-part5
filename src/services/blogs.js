import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const update = async (blog) => {
  const id = blog.id

  const config = {
    headers: { Authorization: token }
  }

  delete blog.id

  blog.user = blog.user.id

  const response = await axios.put(`${baseUrl}/${id}`, blog, config)
  return response.data
}

export default {
  getAll,
  create,
  setToken,
  update
}