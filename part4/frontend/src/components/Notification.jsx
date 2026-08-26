const Notification = ({ notificationData }) => {
  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (notificationData === null) {
    return null
  }
  if (notificationData.eventType === 'error') {
    return <div style={errorStyle}>{notificationData.text}</div>
  }
  if (notificationData.eventType === 'success') {
    return <div style={successStyle}>{notificationData.text}</div>
  }
}
export default Notification
