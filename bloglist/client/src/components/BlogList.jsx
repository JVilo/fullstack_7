import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import blogService from '../services/blogs'
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'

const BlogList = () => {
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
  })

  if (result.isLoading) {
    return <div>loading blogs...</div>
  }

  if (result.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  const blogs = result.data || []
  const sortedBlogs = [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0))

  return (
    <div style={{ marginTop: 20 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        blogs
      </Typography>

      <Paper elevation={1}>
        <List disablePadding>
          {sortedBlogs.map((blog) => (
            <ListItem
              key={blog.id}
              className="showBlog"
              component={Link}
              to={`/blogs/${blog.id}`}
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemText
                primary={blog.title}
                secondary={blog.author ? `by ${blog.author}` : null}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  )
}

export default BlogList