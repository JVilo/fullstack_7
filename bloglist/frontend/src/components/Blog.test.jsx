import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'https://react-testing.com',
    likes: 10,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    },
  }

  test('renders blog details and likes for unauthenticated user, but no buttons', () => {
    render(<Blog blog={blog} user={null} />)

    expect(
      screen.getByText('Testing React Components', { exact: false })
    ).toBeDefined()
    expect(screen.getByText('Test Author', { exact: false })).toBeDefined()
    expect(
      screen.getByText('https://react-testing.com', { exact: false })
    ).toBeDefined()
    expect(screen.getByText('10 likes', { exact: false })).toBeDefined()

    // Haetaan painikkeita roolin mukaan, jolloin "10 likes" -tekstiä ei lasketa mukaan
    const likeButton = screen.queryByRole('button', { name: /like/i })
    const removeButton = screen.queryByRole('button', { name: /remove/i })

    expect(likeButton).toBeNull()
    expect(removeButton).toBeNull()
  })

  test('renders only like button for logged in user who is not the creator', () => {
    const otherUser = {
      username: 'otheruser',
      name: 'Other User',
    }

    render(<Blog blog={blog} user={otherUser} />)

    const likeButton = screen.getByRole('button', { name: /like/i })
    expect(likeButton).toBeDefined()

    const removeButton = screen.queryByRole('button', { name: /remove/i })
    expect(removeButton).toBeNull()
  })

  test('renders both like and remove buttons for creator of the blog', () => {
    const creatorUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    }

    render(<Blog blog={blog} user={creatorUser} />)
    const likeButton = screen.getByRole('button', { name: /like/i })
    const removeButton = screen.getByRole('button', { name: /remove/i })

    expect(likeButton).toBeDefined()
    expect(removeButton).toBeDefined()
  })
})
