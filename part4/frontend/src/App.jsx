import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogInterface from './components/BlogInterface'
import Notification from './components/Notification'

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

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  return (
    <div>
      <Notification notificationData={notificationData} />
      {!user && (
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
        />
      )}

      {user && (
        <BlogInterface
          blogs={blogs}
          user={user}
          handleLogout={handleLogout}
          setBlogs={setBlogs}
          setNotificationData={setNotificationData}
        />
      )}
    </div>
  )
}

export default App
