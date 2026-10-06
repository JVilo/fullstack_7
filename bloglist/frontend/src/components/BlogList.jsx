import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import blogService from '../services/blogs'

const BlogList = () => {
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1
  })

  if (result.isLoading) {
    return <div>loading blogs...</div>
  }

  if (result.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  const blogs = result.data

  const sortedBlogs = [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0))

  return (
    <div>
      <h2>Blogs</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {sortedBlogs.map((blog) => (
          <li key={blog.id} className="showBlog">
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author && `by ${blog.author}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList