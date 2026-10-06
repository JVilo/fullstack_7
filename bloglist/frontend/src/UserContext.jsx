import { createContext, useContext, useReducer } from 'react'
import blogService from './services/blogs'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    case 'CLEAR_USER':
      return null
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null, () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      return user
    }
    return null
  })

  return (
    <UserContext.Provider value={{ user, userDispatch }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context.user
}

export const useUserDispatch = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserDispatch must be used within a UserProvider')
  }
  return context.userDispatch
}

export default UserContext