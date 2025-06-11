import React from "react";
import { Alert, AlertTitle, Box } from "@mui/material";

interface ErrorMessageProps {
  title?: string;
  message: string;
  severity?: "error" | "warning" | "info" | "success";
  action?: React.ReactNode;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  severity = "error",
  action,
}) => {
  return (
    <Box mb={3}>
      <Alert severity={severity} action={action}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
