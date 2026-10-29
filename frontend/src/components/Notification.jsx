import useNotificationStore from '../stores/notificationStore'

const Notification = () => {
  const notification = useNotificationStore(
    (state) => state.notification
  )

  if (!notification) {
    return null
  }

  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

export default Notification