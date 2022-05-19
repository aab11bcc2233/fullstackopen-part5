import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import localUser from './utils/user'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  const [noticeObj, setNoticeObj] = useState({ message: null, color: "green" })

  const showNotification = (message, color) => {
    setNoticeObj({ message, color })

    setTimeout(() => setNoticeObj({ message: null }), 5000);
  }

  const clickLogin = async (event) => {
    event.preventDefault()
    console.log("login in with", username, password)

    try {
      const user = await loginService.login({ username, password })

      blogService.setToken(user.token)
      localUser.save(user)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log('login fails', error)
      showNotification(error.response.data.error, "red")
    }
  }

  const clickLogout = (event) => {
    console.log(event)
    localUser.remove()
    blogService.setToken(null)
    setUser(null)
  }

  const clickCreateBlog = async (event) => {
    event.preventDefault()

    try {
      const data = await blogService.create({
        title: title,
        author: author,
        url: url
      })
      console.log("create a new blog succeed", data)

      setTitle("")
      setAuthor("")
      setUrl("")

      showNotification(`a new blog You're NOT gonna neet it! by added ${user.name}`, "green")
    } catch (error) {
      console.log('create a new blog fails', error.response.data.error)

      if (error.response.status === 401) {
        clickLogout()
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
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
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

      {
        blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )
      }
    </div >
  )
}

export default App
