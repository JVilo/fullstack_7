import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material'
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
        <Typography variant="h6" component="h3" sx={{ fontWeight: 500, mb: 2 }}>
          added blogs
        </Typography>
        {userBlogs.length > 0 ? (
          <Paper variant="outlined">
            <List disablePadding>
              {userBlogs.map((blog, index) => (
                <div key={blog.id}>
                  {index > 0 && <Divider />}
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
                      <ListItemText primary={blog.title} />
                    </ListItemButton>
                  </ListItem>
                </div>
              ))}
            </List>
          </Paper>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No blogs created yet.
          </Typography>
        )}
      </Box>
    </Paper>
  )
}

export default User