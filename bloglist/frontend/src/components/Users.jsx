import { useQuery } from '@tanstack/react-query'
import usersService from '../services/users'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material'

const Users = () => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
  })

  if (result.isLoading) {
    return <div>loading users...</div>
  }

  if (result.isError) {
    return <div>user service not available due to problems in server</div>
  }

  const users = result.data || []

  return (
    <div style={{ marginTop: 20 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.blogs?.length || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users