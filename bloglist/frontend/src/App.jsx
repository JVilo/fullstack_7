import { useState } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Users from './components/Users'
import blogService from './services/blogs'
import loginService from './services/login'
import './style.css'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound.jsx'
import { useNotify } from './NotificationContext'
import { useUser, useUserDispatch } from './UserContext'
import { useQuery } from '@tanstack/react-query'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const notify = useNotify()
  const user = useUser()
  const userDispatch = useUserDispatch()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const blogs = result.data || []
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      userDispatch({ type: 'SET_USER', payload: loggedUser })
      setUsername('')
      setPassword('')
      notify(`${loggedUser.name} logged in successfully`, 5)
      navigate('/')
    } catch {
      setUsername('')
      setPassword('')
      notify('wrong username or password', 5)
    }
  }

  const handleLogout = () => {
    userDispatch({ type: 'CLEAR_USER' })
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
    notify('Logged out successfully', 5)
    navigate('/')
  }

  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
            home
          </Button>
          <Button color="inherit" component={Link} to="/users" sx={hoverStyle}>
            users
          </Button>
          {user ? (
            <span>
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={hoverStyle}
              >
                create new
              </Button>
              <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>
                logout
              </Button>
            </span>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={hoverStyle}
            >
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div>
        <Notification />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/users" element={<Users />} />

            <Route
              path="/login"
              element={
                <LoginForm
                  username={username}
                  password={password}
                  handleUsernameChange={({ target }) =>
                    setUsername(target.value)
                  }
                  handlePasswordChange={({ target }) =>
                    setPassword(target.value)
                  }
                  handleSubmit={handleLogin}
                />
              }
            />

            <Route path="/create" element={<BlogForm />} />

            <Route
              path="/blogs/:id"
              element={
                blog ? (
                  <Blog blog={blog} />
                ) : (
                  <NotFound />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Container>
  )
}

export default App