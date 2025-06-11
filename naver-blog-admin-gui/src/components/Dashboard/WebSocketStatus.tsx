import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorIcon from "@mui/icons-material/Error";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import StatusBadge from "../common/StatusBadge";

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6);
  }
  100% {
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }
`;

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StatusCard = styled(Card)<{ status: string }>(({ theme, status }) => ({
  background:
    status === "connected"
      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)"
      : status === "error"
        ? "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)"
        : "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  border:
    status === "connected"
      ? "2px solid rgba(16, 185, 129, 0.3)"
      : status === "error"
        ? "2px solid rgba(239, 68, 68, 0.3)"
        : "1px solid rgba(255, 255, 255, 0.1)",
  padding: theme.spacing(2),
  transition: "all 0.3s ease",
  animation:
    status === "connected"
      ? `${glowAnimation} 2s ease-in-out infinite`
      : "none",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const ConnectionIcon = styled(Box)<{ status: string }>(({ theme, status }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "56px",
  height: "56px",
  borderRadius: "16px",
  backgroundColor: getStatusBackground(status),
  marginRight: theme.spacing(2),
  transition: "all 0.3s ease",
  animation:
    status === "connected"
      ? `${pulseAnimation} 2s ease-in-out infinite`
      : "none",
}));

const StatusIndicator = styled(Box)<{ status: string }>(
  ({ theme, status }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(0.5, 1.5),
    borderRadius: "20px",
    background: getStatusGradient(status),
    boxShadow: getStatusShadow(status),
    border: `2px solid ${getStatusBorderColor(status)}`,
  })
);

function getStatusBackground(status: string): string {
  switch (status) {
    case "connected":
      return "rgba(16, 185, 129, 0.2)";
    case "connecting":
      return "rgba(245, 158, 11, 0.2)";
    case "error":
      return "rgba(239, 68, 68, 0.2)";
    case "disconnected":
    default:
      return "rgba(107, 114, 128, 0.2)";
  }
}

function getStatusGradient(status: string): string {
  switch (status) {
    case "connected":
      return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
    case "connecting":
      return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
    case "error":
      return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
    case "disconnected":
    default:
      return "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)";
  }
}

function getStatusShadow(status: string): string {
  switch (status) {
    case "connected":
      return "0 4px 15px rgba(16, 185, 129, 0.4)";
    case "connecting":
      return "0 4px 15px rgba(245, 158, 11, 0.4)";
    case "error":
      return "0 4px 15px rgba(239, 68, 68, 0.4)";
    case "disconnected":
    default:
      return "0 4px 15px rgba(107, 114, 128, 0.4)";
  }
}

function getStatusBorderColor(status: string): string {
  switch (status) {
    case "connected":
      return "rgba(16, 185, 129, 0.6)";
    case "connecting":
      return "rgba(245, 158, 11, 0.6)";
    case "error":
      return "rgba(239, 68, 68, 0.6)";
    case "disconnected":
    default:
      return "rgba(107, 114, 128, 0.6)";
  }
}

function getStatusIcon(status: string): React.ReactNode {
  const iconStyle = { fontSize: "28px" };

  switch (status) {
    case "connected":
      return <WifiIcon sx={{ ...iconStyle, color: "#10b981" }} />;
    case "connecting":
      return (
        <RefreshIcon
          sx={{
            ...iconStyle,
            color: "#f59e0b",
            animation: `${spinAnimation} 1s linear infinite`,
          }}
        />
      );
    case "error":
      return <ErrorIcon sx={{ ...iconStyle, color: "#ef4444" }} />;
    case "disconnected":
    default:
      return <WifiOffIcon sx={{ ...iconStyle, color: "#6b7280" }} />;
  }
}

export interface WebSocketStatusProps {
  status: "connecting" | "connected" | "disconnected" | "error";
  onReconnect?: () => void;
  lastConnected?: string;
  errorMessage?: string;
}

const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
  status,
  onReconnect,
  lastConnected,
  errorMessage,
}) => {
  const getStatusMessage = (): string => {
    switch (status) {
      case "connected":
        return "실시간 연결 활성화 - 모든 데이터가 실시간으로 업데이트됩니다";
      case "connecting":
        return "서버와 연결을 시도하고 있습니다...";
      case "error":
        return (
          errorMessage || "연결 중 오류가 발생했습니다. 재연결을 시도해주세요."
        );
      case "disconnected":
        return "서버와의 연결이 끊어졌습니다. 실시간 업데이트가 중단됩니다.";
      default:
        return "알 수 없는 연결 상태";
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case "connected":
        return "🟢 연결됨";
      case "connecting":
        return "🟡 연결 중";
      case "error":
        return "🔴 오류";
      case "disconnected":
        return "⚫ 연결 안됨";
      default:
        return "❓ 알 수 없음";
    }
  };

  const formatLastConnected = (): string => {
    if (!lastConnected) return "";

    const now = new Date();
    const lastTime = new Date(lastConnected);
    const diffMs = now.getTime() - lastTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "방금 전 연결";
    if (diffMinutes < 60) return `${diffMinutes}분 전 연결`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전 연결`;

    return lastTime.toLocaleDateString("ko-KR");
  };

  return (
    <StatusCard elevation={0} status={status}>
      <CardContent sx={{ padding: 3, "&:last-child": { paddingBottom: 3 } }}>
        <Box display="flex" alignItems="center">
          <ConnectionIcon status={status}>
            {getStatusIcon(status)}
          </ConnectionIcon>

          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Typography
                variant="h5"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "1.3rem",
                }}
              >
                WebSocket 실시간 연결
              </Typography>

              <StatusIndicator status={status}>
                <FiberManualRecordIcon
                  sx={{ fontSize: "12px", color: "#ffffff" }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  {getStatusText()}
                </Typography>
              </StatusIndicator>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color:
                  status === "connected"
                    ? "rgba(16, 185, 129, 0.9)"
                    : status === "error"
                      ? "rgba(239, 68, 68, 0.9)"
                      : "rgba(255, 255, 255, 0.7)",
                fontSize: "0.95rem",
                mb: lastConnected && status !== "connected" ? 1 : 0,
                fontWeight: 500,
              }}
            >
              {getStatusMessage()}
            </Typography>

            {lastConnected && status !== "connected" && (
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                }}
              >
                {formatLastConnected()}
              </Typography>
            )}
          </Box>

          {onReconnect && status !== "connected" && status !== "connecting" && (
            <Tooltip title="다시 연결 시도">
              <IconButton
                onClick={onReconnect}
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    color: "#ffffff",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
                size="large"
              >
                <RefreshIcon sx={{ fontSize: "24px" }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </StatusCard>
  );
};

export default WebSocketStatus;
