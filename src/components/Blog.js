import { useState } from "react"
import blogService from "../services/blogs"

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [likes, setLikes] = useState(blog.likes)
  const [viewAll, setViewAll] = useState(false)

  const toggleViewAll = () => setViewAll(!viewAll)

  const clickLike = async () => {
    try {
      const newBlog = {
        ...blog,
        likes: likes + 1
      }
      const data = await blogService.update(newBlog)
      console.log("add like succeed", data)
      setLikes(data.likes)
    } catch (error) {
      console.log("add like error", error)
    }
  }

  const displayStyle = {
    display: viewAll ? "" : "none"
  }

  return (
    <div style={blogStyle}>
      <div>{blog.title} <button onClick={toggleViewAll}>{viewAll ? "hide" : "view"}</button></div>

      <div style={displayStyle}>
        <div>{blog.url}</div>
        <div>likes {likes} <button onClick={clickLike}>like</button></div>
        <div>{blog.author}</div>
      </div>
    </div>
  )
}

export default Blog