import { useState } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User.jsx'
import blogService from './services/blogs'
import usersService from './services/users'
import loginService from './services/login'
import './style.css'
import { Container, AppBar, Toolbar, Button, Typography, Box } from '@mui/material'
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

  const blogsResult = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const usersResult = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
  })

  const blogs = blogsResult.data || []
  const users = usersResult.data || []

  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch ? blogs.find((b) => b.id === blogMatch.params.id) : null

  const userMatch = useMatch('/users/:id')
  const selectedUser = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null

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

  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }

  return (
    <Container maxWidth="md" sx={{ pb: 5 }}>
      <AppBar position="static" sx={{ borderRadius: 1, mt: 2 }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Blog App
          </Typography>

          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users" sx={hoverStyle}>
            users
          </Button>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={hoverStyle}
              >
                new blog
              </Button>
              <Typography variant="body2" sx={{ mx: 1.5, opacity: 0.9 }}>
                <em>{user.name} logged in</em>
              </Typography>
              <Button
                color="inherit"
                variant="outlined"
                size="small"
                onClick={handleLogout}
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: '#fff',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                logout
              </Button>
            </Box>
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

      <Box sx={{ mt: 3 }}>
        <Notification />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/users" element={<Users />} />
            <Route
              path="/users/:id"
              element={
                selectedUser ? (
                  <User user={selectedUser} />
                ) : (
                  <NotFound />
                )
              }
            />

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
      </Box>
    </Container>
  )
}

export default App