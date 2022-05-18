import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import localUser from './utils/user'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  const clickLogin = async (event) => {
    event.preventDefault()
    console.log("login in with", username, password)

    try {
      const user = await loginService.login({ username, password })
      localUser.save(user)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log('login fails', error)
    }
  }

  const clickLogout = (event) => {
    console.log(event)
    localUser.remove()
    setUser(null)
  }


  useEffect(() => {
    const userFromLocal = localUser.get()
    if (userFromLocal) {
      setUser(userFromLocal)
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
      <div>
        <strong>{user.name} logged in</strong> <button onClick={clickLogout}>logout</button>
      </div>
      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
