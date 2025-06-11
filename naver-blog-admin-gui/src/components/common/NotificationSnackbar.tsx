import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useUIStore } from "../../store";

const NotificationSnackbar: React.FC = () => {
  const { notification, clearNotification } = useUIStore();
  const { type, message } = notification;

  const handleClose = () => {
    clearNotification();
  };

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      {message && type && (
        <Alert onClose={handleClose} severity={type} variant="filled">
          {message}
        </Alert>
      )}
    </Snackbar>
  );
};

export default NotificationSnackbar;
