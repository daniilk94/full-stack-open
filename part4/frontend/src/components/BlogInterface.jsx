import { useState } from 'react'
import Blog from './Blog'
import BlogCreationForm from './BlogCreationForm'
import blogService from '../services/blogs'

const BlogInterface = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url,
      }
      const createdBlog = await blogService.createBlog(newBlog)
      props.setBlogs(props.blogs.concat(createdBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      props.setNotificationData({
        eventType: 'success',
        text: `A new blog "${createdBlog.title}" by ${createdBlog.author} added`,
      })
      setTimeout(() => {
        props.setNotificationData(null)
      }, 3000)
    } catch (error) {
      props.setNotificationData({
        eventType: 'error',
        text: error.response.data.error,
      })
      setTimeout(() => {
        props.setNotificationData(null)
      }, 3000)
    }
  }
  return (
    <div>
      <h2>Blog List Application</h2>
      <p>
        {props.user.name} logged in{' '}
        <button type="button" onClick={props.handleLogout}>
          Logout
        </button>
      </p>
      <BlogCreationForm
        title={title}
        author={author}
        url={url}
        addBlog={addBlog}
        handleTitleChange={handleTitleChange}
        handleAuthorChange={handleAuthorChange}
        handleUrlChange={handleUrlChange}
      />
      {props.blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogInterface
