import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Notification = () => {
  const { toast } = useSelector((state) => state.ui);
  const [backgroundColor, setBackgroundColor] = useState("#41A3E2");
  const [type, setType] = useState(<i className={`fas fa-info-circle`}></i>);
  useEffect(() => {
    switch (toast.type) {
      case "success":
        setBackgroundColor("#07C50E");
        setType(<i className={`fas fa-check-circle`}></i>);
        break;
      case "failure":
        setBackgroundColor("#E85642");
        setType(<i class="fas fa-bug"></i>);
        break;
      default:
    }
  }, [backgroundColor, toast.type]);

  return (
    <div
      className="notification-wrapper"
      style={{
        backgroundColor,
        transform: `translateX(${toast.display ? "0" : "100vw"})`,
      }}
    >
      <div className="notification">
        <div className="notification__icon">{type}</div>
        <div className="notification__text">{toast.msg}</div>
      </div>
    </div>
  );
};

export default Notification;
