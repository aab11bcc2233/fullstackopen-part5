import React from 'react'


const Notification = ({ message, color }) => {
  if (!message) {
    return null
  }

  const noticeStyle = {
    'background': 'lightgray',
    'border': '0.25rem solid',
    'borderRadius': '4px',
    'padding': '1em',
    'color': color,
    'fontSize': 'larger',
    'margin': '1em 0'
  }

  return (
    <div className='notification' style={noticeStyle}>
      {message}
    </div>
  )
}


export default Notification