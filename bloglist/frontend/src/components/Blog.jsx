import { Paper, Typography, Button, Box } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { useNotify } from '../NotificationContext'
import { useUser } from '../UserContext'

const Blog = ({ blog }) => {
  const queryClient = useQueryClient()
  const notify = useNotify()
  const navigate = useNavigate()
  const user = useUser()

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(updatedBlog.id, updatedBlog),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`You liked '${updated.title}'`, 5)
    },
    onError: () => {
      notify('Liking failed', 5)
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`Deleted '${blog.title}'`, 5)
      navigate('/')
    },
    onError: () => {
      notify('Removing failed', 5)
    },
  })

  if (!blog) {
    return null
  }

  const isOwner = user && (blog.user?.username === user.username || !blog.user)

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
      user: blog.user?.id || blog.user,
    }
    updateBlogMutation.mutate(updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete ${blog.title}?`)) {
      deleteBlogMutation.mutate(blog.id)
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 500, mb: 1 }}>
        {blog.title}
      </Typography>

      {blog.author && (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 2, fontWeight: 400 }}
        >
          by {blog.author}
        </Typography>
      )}

      <Box sx={{ mb: 1 }}>
        <a
          href={blog.url}
          target="_blank"
          rel="noreferrer"
          style={{
            color: '#1976d2',
            fontSize: '1.1rem',
            textDecoration: 'underline',
          }}
        >
          {blog.url}
        </a>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Added by {blog.user?.name || blog.author || 'unknown'}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {blog.likes || 0} likes
        </Typography>

        {user && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleLike}
          >
            LIKE
          </Button>
        )}

        {isOwner && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleDelete}
          >
            REMOVE
          </Button>
        )}
      </Box>
    </Paper>
  )
}

export default Blog