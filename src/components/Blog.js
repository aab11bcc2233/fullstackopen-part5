import { useState } from "react"

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [viewAll, setViewAll] = useState(false)

  const toggleViewAll = () => setViewAll(!viewAll)

  const displayStyle = {
    display: viewAll ? "" : "none"
  }

  return (
    <div style={blogStyle}>
      <div>{blog.title} <button onClick={toggleViewAll}>{viewAll ? "hide" : "view"}</button></div>

      <div style={displayStyle}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button>like</button></div>
        <div>{blog.author}</div>
      </div>
    </div>
  )
}

export default Blog