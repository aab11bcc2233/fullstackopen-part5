import React, { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ onSuccess, onError }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const clickCreateBlog = async (event) => {
    event.preventDefault()

    try {
      const data = await blogService.create({
        title: title,
        author: author,
        url: url
      })
      console.log('create a new blog succeed', data)

      setTitle('')
      setAuthor('')
      setUrl('')

      onSuccess(data)
    } catch (error) {
      console.log('create a new blog fails', error.response.data.error)
      onError(error)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <div>
        <form onSubmit={clickCreateBlog}>
          <div>
            title:<input type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
          </div>

          <div>
            author:<input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
          </div>

          <div>
            url:<input type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    </div>
  )
}

export default BlogForm