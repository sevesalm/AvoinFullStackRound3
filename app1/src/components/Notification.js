import React from "react";

const Notification = ({ data }) =>
  data !== null ? (
    <div
      className={data.type === 1 ? "notification error" : "notification info"}
    >
      {data.message}
    </div>
  ) : null;

export default Notification;
