import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import localUser from './utils/user'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [noticeObj, setNoticeObj] = useState({ message: null, color: 'green' })

  const blogFormRef = useRef()

  const showNotification = (message, color) => {
    setNoticeObj({ message, color })

    setTimeout(() => setNoticeObj({ message: null }), 5000)
  }

  const onRequestError = (error) => {
    if (error.response.status === 401) {
      clickLogout()
      showNotification('You need to log in again', 'red')
    } else {
      showNotification(error.response.data.error, 'red')
    }
  }

  const clickLogin = async (event) => {
    event.preventDefault()
    console.log('login in with', username, password)

    try {
      const user = await loginService.login({ username, password })

      blogService.setToken(user.token)
      localUser.save(user)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log('login fails', error)
      showNotification(error.response.data.error, 'red')
    }
  }

  const clickLogout = (event) => {
    console.log(event)
    localUser.remove()
    blogService.setToken(null)
    setUser(null)
  }

  const requestCreateBlog = async (newBlog) => {
    try {
      const data = await blogService.create(newBlog)
      showNotification(`a new blog ${data.title}! by added ${user.name}`, 'green')
      setBlogs(blogs.concat(data))
      blogFormRef.current.toggleVisibility()
      return data
    } catch (error) {
      onRequestError(error)

      return error.response.data
    }
  }



  const onClickLike = async (blog) => {
    try {
      const newBlog = {
        ...blog,
        likes: blog.likes + 1
      }
      const data = await blogService.update(newBlog)
      console.log('add like succeed', data)
      setBlogs(
        blogs.map(v => {
          if (v.id === data.id) {
            v.likes = data.likes
          }
          return v
        })
          .sort((a, b) => b.likes - a.likes)
      )
    } catch (error) {
      console.log('add like error', error)
      onRequestError(error)
    }
  }

  const onClickRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title}! by ${user.username}`)) {
      try {
        await blogService.deleteById(blog.id)
        console.log('remove blog succeed')
        setBlogs(
          blogs.filter(v => v.id !== blog.id)
            .sort((a, b) => b.likes - a.likes)
        )
      } catch (error) {
        console.log('remove blog error', error)
        onRequestError(error)
      }
    }
  }



  useEffect(() => {
    const userFromLocal = localUser.get()
    if (userFromLocal) {
      setUser(userFromLocal)
      blogService.setToken(userFromLocal.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={noticeObj.message} color={noticeObj.color} />

        <form onSubmit={clickLogin}>
          <div>
            username<input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>

          <div>
            password<input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }


  return (
    <div>
      <h2>blogs</h2>

      <Notification message={noticeObj.message} color={noticeObj.color} />

      <div>
        <strong>{user.name} logged in</strong> <button onClick={clickLogout}>logout</button>
      </div>
      <br />

      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm requestCreateBlog={requestCreateBlog} />
      </Togglable>

      {
        blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            onClickLike={onClickLike}
            isShowRemove={blog.user.username === user.username}
            onClickRemove={onClickRemove}
          />
        )
      }
    </div >
  )
}

export default App

