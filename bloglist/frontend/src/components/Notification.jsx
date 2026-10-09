import { Alert } from '@mui/material'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) {
    return null
  }

  const isError =
    notification.toLowerCase().includes('fail') ||
    notification.toLowerCase().includes('wrong') ||
    notification.toLowerCase().includes('error')

  return (
    <Alert severity={isError ? 'error' : 'success'} sx={{ my: 2 }} data-testid="notification">
      {notification}
    </Alert>
  )
}

export default Notification