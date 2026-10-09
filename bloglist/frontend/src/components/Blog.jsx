import { useState } from 'react'
import {
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { useNotify } from '../NotificationContext'
import { useUser } from '../UserContext'

const Blog = ({ blog }) => {
  const [commentText, setCommentText] = useState('')
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

  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.comment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`Comment added to '${blog.title}'`, 5)
      setCommentText('')
    },
    onError: () => {
      notify('Adding comment failed', 5)
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

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    if (!commentText.trim()) return
    addCommentMutation.mutate({ id: blog.id, comment: commentText })
  }

  return (
    <Paper elevation={2} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 500, mb: 1 }}>
        {blog.title}
      </Typography>

      {blog.author && (
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 400 }}>
          by {blog.author}
        </Typography>
      )}

      <Box sx={{ mb: 1 }}>
        <a
          href={blog.url}
          target="_blank"
          rel="noreferrer"
          style={{ color: '#1976d2', fontSize: '1.1rem', textDecoration: 'underline' }}
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
          <Button variant="outlined" color="primary" size="small" onClick={handleLike}>
            LIKE
          </Button>
        )}

        {isOwner && (
          <Button variant="outlined" color="error" size="small" onClick={handleDelete}>
            REMOVE
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          comments
        </Typography>

        <Box
          component="form"
          onSubmit={handleCommentSubmit}
          sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}
        >
          <TextField
            size="small"
            label="add a comment..."
            value={commentText}
            onChange={({ target }) => setCommentText(target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button type="submit" variant="contained" sx={{ bgcolor: 'primary.dark' }}>
            add comment
          </Button>
        </Box>

        {blog.comments && blog.comments.length > 0 ? (
          <Paper variant="outlined">
            <List disablePadding>
              {blog.comments.map((comment, index) => (
                <div key={index}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText primary={comment} />
                  </ListItem>
                </div>
              ))}
            </List>
          </Paper>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No comments yet.
          </Typography>
        )}
      </Box>
    </Paper>
  )
}

export default Blog