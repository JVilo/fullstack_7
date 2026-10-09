import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import blogService from '../services/blogs'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
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

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {sortedBlogs.map((blog) => (
              <TableRow key={blog.id} hover>
                <TableCell>
                  <Link
                    to={`/blogs/${blog.id}`}
                    style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}
                  >
                    {blog.title}
                  </Link>
                </TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary' }}>
                  {blog.author && `by ${blog.author}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList