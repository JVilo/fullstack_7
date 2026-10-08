import { Paper, Typography, Box } from '@mui/material'
import { Link } from 'react-router-dom'

const User = ({ user }) => {
  if (!user) {
    return null
  }
  const userBlogs = user.blogs || []

  return (
    <Paper elevation={2} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 500, mb: 1 }}>
        {user.name}
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 500, mb: 1 }}>
          added blogs
        </Typography>
        {userBlogs.length > 0 ? (
          <ul>
            {userBlogs.map((blog) => (
              <li key={blog.id}>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="body2">No blogs created yet.</Typography>
        )}
      </Box>
    </Paper>
  )
}

export default User