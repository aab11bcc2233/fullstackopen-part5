import React, { useState } from 'react'

const Blog = ({ blog, onClickLike, isShowRemove, onClickRemove }) => {
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
    display: viewAll ? '' : 'none'
  }

  const removeBtnDisplayStyle = {
    display: isShowRemove ? '' : 'none'
  }

  return (
    <div className='blog-item' style={blogStyle}>
      <div>{blog.title} {blog.author} <button className='viewAll' onClick={toggleViewAll}>{viewAll ? 'hide' : 'view'}</button></div>

      <div className='blogDetail' style={displayStyle}>
        <div className='blogUrl'>{blog.url}</div>
        <div className='blogLikes'>likes {blog.likes} <button className='btnLikes' onClick={() => { onClickLike(blog) }}>like</button></div>
        <div>{blog.author}</div>
        <button style={removeBtnDisplayStyle} onClick={() => onClickRemove(blog)}>remove</button>
      </div>
    </div>
  )
}

export default Blog