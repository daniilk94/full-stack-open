import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notificationData, setNotificationData] = useState(null)

  useEffect(() => {
    function loadingUserFromLocalStorage() {
      const loggedUserJSON = window.localStorage.getItem(
        'loggedBlogListAppUser',
      )
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      }
    }
    loadingUserFromLocalStorage()
  }, [])

  useEffect(() => {
    async function getBlogs() {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    getBlogs()
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogListAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setNotificationData({
        eventType: 'error',
        text: error.response.data.error,
      })
      setTimeout(() => {
        setNotificationData(null)
      }, 3000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogListAppUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.createBlog(blogObject)
      setBlogs(blogs.concat(newBlog))
      setNotificationData({
        eventType: 'success',
        text: `A new blog "${blogObject.title}" by ${blogObject.author} added`,
      })
      setTimeout(() => {
        setNotificationData(null)
      }, 3000)
    } catch (error) {
      setNotificationData({
        eventType: 'error',
        text: error.response.data.error,
      })
      setTimeout(() => {
        setNotificationData(null)
      }, 3000)
    }
  }

  return (
    <div>
      <h1>Blog List Application</h1>
      <Notification notificationData={notificationData} />

      {!user && (
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />
      )}

      {user && (
        <div>
          <p>
            {user.name} logged in{' '}
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </p>
          <Togglable buttonLable="Create new blog">
            <BlogForm onCreateBlog={addBlog} onLogout={handleLogout} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
