import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface FormDialogProps {
  open: boolean;
  title: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  submitText?: string;
  cancelText?: string;
  onSubmit: () => void;
  onClose: () => void;
  children: React.ReactNode;
  isSubmitting?: boolean;
  disableSubmit?: boolean;
}

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  title,
  maxWidth = "sm",
  submitText = "저장",
  cancelText = "취소",
  onSubmit,
  onClose,
  children,
  isSubmitting = false,
  disableSubmit = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton aria-label="close" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          {cancelText}
        </Button>
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          disabled={isSubmitting || disableSubmit}
        >
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
