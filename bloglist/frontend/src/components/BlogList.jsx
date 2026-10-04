import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const style = {
    listStyleType: 'none',
    padding: 0
  }

  const sortedBlogs = [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0))

  return (
    <div>
      <h2>Blogs</h2>
      <ul style={style}>
        {sortedBlogs.map(blog => (
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