import { Paper, Typography, Button, Box } from '@mui/material'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  if (!blog) {
    return null
  }

  const isOwner = user && (blog.user?.username === user.username || !blog.user)

  return (
    <Paper elevation={2} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
      {/* Blogin otsikko */}
      <Typography variant="h4" component="h2" sx={{ fontWeight: 500, mb: 1 }}>
        {blog.title}
      </Typography>

      {/* Kirjoittaja */}
      {blog.author && (
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 400 }}>
          by {blog.author}
        </Typography>
      )}

      {/* Linkki */}
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

      {/* Lisääjä */}
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Added by {blog.user?.name || blog.author || 'unknown'}
      </Typography>

      {/* Tykkäykset ja napit samalla rivillä */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {blog.likes || 0} likes
        </Typography>

        {user && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleLike(blog.id)}
          >
            LIKE
          </Button>
        )}

        {isOwner && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(blog.id, blog.title)}
          >
            REMOVE
          </Button>
        )}
      </Box>
    </Paper>
  )
}

export default Blog