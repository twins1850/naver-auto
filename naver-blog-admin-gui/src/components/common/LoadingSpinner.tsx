import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  color: "#ffffff",
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: "#3b82f6",
  marginBottom: theme.spacing(3),
}));

export interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "로딩 중...",
  size = 60,
}) => {
  return (
    <LoadingContainer>
      <StyledCircularProgress size={size} thickness={4} />
      <Typography
        variant="h6"
        sx={{
          color: "rgba(255, 255, 255, 0.8)",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        {message}
      </Typography>
    </LoadingContainer>
  );
};

export default LoadingSpinner;
