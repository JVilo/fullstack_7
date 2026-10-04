import { TextField, Button } from '@mui/material'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <TextField
              label="username"
              value={username}
              autoComplete="username"
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            <TextField
              type="password"
              label="password"
              value={password}
              autoComplete="current-password"
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
