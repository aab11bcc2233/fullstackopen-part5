import React, { useState } from 'react'

const BlogForm = ({ requestCreateBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const clickCreateBlog = async (event) => {
    event.preventDefault()

    const data = await requestCreateBlog({
      title: title,
      author: author,
      url: url
    })

    if (data !== undefined && data.id !== undefined) {
      console.log('create a new blog succeed', data)

      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <div>
        <form className='formDiv' onSubmit={clickCreateBlog}>
          <div>
            title:<input id='inputTitle' type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
          </div>

          <div>
            author:<input id='inputAuthor' type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
          </div>

          <div>
            url:<input id='inputUrl' type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    </div>
  )
}

export default BlogForm