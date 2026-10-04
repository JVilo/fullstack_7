// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((max, blog) => (max.likes > blog.likes ? max : blog))
}
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCount = {}

  blogs.forEach((blog) => {
    authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
  })

  const maxAuthor = Object.keys(authorCount).reduce((max, author) => {
    return authorCount[author] > authorCount[max] ? author : max
  })

  return { author: maxAuthor, blogs: authorCount[maxAuthor] }
}
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = {}

  blogs.forEach((blog) => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
  })

  const maxAuthor = Object.keys(authorLikes).reduce((max, author) => {
    return authorLikes[author] > authorLikes[max] ? author : max
  })

  return { author: maxAuthor, likes: authorLikes[maxAuthor] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}