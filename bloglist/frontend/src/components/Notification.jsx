import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const messageText = notification.message || notification.text || notification.name

  if (!messageText) {
    return null
  }

  const severity = notification.type === 'error' ? 'error' : 'success'

  return (
    <Alert severity={severity} style={{ marginTop: 10, marginBottom: 10 }}>
      {messageText}
    </Alert>
  )
}

export default Notification