import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../hooks/UserContext";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import axios from "axios";

const NotificationPopup = ({ anchorEl, onClose, notifications }) => {
  const open = Boolean(anchorEl);

  const handleClose = () => {
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        style: {
          maxWidth: "300px",
        },
      }}
    >
      {notifications &&
        notifications.map((notification, index) => (
          <div key={index} style={{ display: "block" }}>
            <Typography
              style={{
                padding: "7px 15px 5px 20px",
                fontSize: "16px",
                maxWidth: "calc(100% - 60px)", // Adjust as needed
                overflowWrap: "break-word",
              }}
            >
              {notification.message}
            </Typography>
            <Typography
              sx={{ fontSize: 12, color: "gray", paddingLeft: "40%" }}
            >
              {formatDateTime(notification.datetime_created)}
            </Typography>
            {index !== notifications.length - 1 && (
              <div style={{ padding: "0 20px" }}>
                <hr style={{ borderTop: "1px solid #ccc", margin: "8px 0" }} />
              </div>
            )}
          </div>
        ))}
    </Popover>
  );
};

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
};

export default NotificationPopup;
