import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './style.css'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(loggedUser.token)
      return loggedUser
    }
    return null
  })

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
  }, [])

  const showNotification = (message, type = 'notification') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ message: `${user.name} logged in successfully`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      navigate('/')
    } catch {
      setUsername('')
      setPassword('')

      setNotification({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
    setNotification({text:'logged out', type: 'success'})
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const loggedUser = JSON.parse(loggedUserJSON)
        blogService.setToken(loggedUser.token)
      }

      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification({
        message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        type: 'success'
      })
      navigate('/')
    } catch (exception) {
      console.error('Blog creation error:', exception)

      const errorMessage = exception.response?.data?.error || 'Creating blog failed'

      setNotification({ message: errorMessage, type: 'error' })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLike = async (id) => {
    if (!user) return

    const blogToLike = blogs.find(b => b.id === id)
    const updatedBlog = {
      ...blogToLike,
      likes: (blogToLike.likes || 0) + 1,
      user: blogToLike.user?.id || blogToLike.user
    }

    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog))
    } catch {
      setNotification({name:'Liking failed', type: 'error'})
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete ${title}?`)) return
    try {
      if (user?.token) {
        blogService.setToken(user.token)
      }
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      setNotification({neme:'Deleted ${title}'})

      navigate('/')
    } catch {
      setNotification({name: 'Removing failed', type: 'error'})
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  const padding = { paddingRight: 5 }
  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
      <Container>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
              home
            </Button>
            {user ? (
              <span>
                <Button color="inherit" component={Link} to="/create" sx={hoverStyle}>
                  create new
                </Button>
                <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>
                  logout
                </Button>
              </span>
            ) : (
              <Button color="inherit" component={Link} to="/login" sx={hoverStyle}>
                login
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <div>
          <Notification notification={notification} />
          <ErrorBoundary>
          <Routes>
            <Route path="/" element={<BlogList blogs={blogs} />} />

            <Route path="/login" element={
              <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
              />
            } />

            <Route path="/create" element={
              <BlogForm createBlog={addBlog} />
            } />

            <Route path="/blogs/:id" element={
              <Blog
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                user={user}
              />
            } />
          </Routes>
          </ErrorBoundary>
        </div>
      </Container>
  )
}

export default App