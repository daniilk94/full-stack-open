const Notification = ({ message }) => {
  const successStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (message === null) {
    return null;
  }
  if (message.type === "error") {
    return <div style={errorStyle}>{message.text}</div>;
  }
  if (message.type === "success") {
    return <div style={successStyle}>{message.text}</div>;
  }
};
export default Notification;
