import React from "react";

const Notification = ({ message, type }) => {
  return (
    <div
      style={{
        minWidth: "400px",
      }}
      className={`alert alert-${type} mt-3`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Notification;
