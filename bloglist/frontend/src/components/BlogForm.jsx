import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotify } from '../NotificationContext'

const BlogForm = () => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const queryClient = useQueryClient()
  const notify = useNotify()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`A new blog '${newBlog.title}' by ${newBlog.author} added`, 5)
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    },
    onError: (exception) => {
      const errorMessage =
        exception.response?.data?.error || 'Creating blog failed'
      notify(errorMessage, 5)
    }
  })

  const addBlog = (e) => {
    e.preventDefault()
    newBlogMutation.mutate({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="author"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm