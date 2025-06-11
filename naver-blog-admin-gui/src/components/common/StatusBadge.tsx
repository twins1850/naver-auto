import React from "react";
import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export interface StatusBadgeProps {
  status:
    | "connected"
    | "starting"
    | "running"
    | "completed"
    | "failed"
    | "error"
    | "disconnected";
  label?: string;
  size?: "small" | "medium";
  showIcon?: boolean;
}

const StyledChip = styled(Chip)<{ statuscolor: string }>(
  ({ theme, statuscolor }) => ({
    borderRadius: "20px",
    fontWeight: 600,
    fontSize: "0.75rem",
    border: `2px solid ${statuscolor}`,
    backgroundColor: `${statuscolor}15`,
    color: statuscolor,
    "& .MuiChip-icon": {
      color: statuscolor,
    },
    "&:hover": {
      backgroundColor: `${statuscolor}25`,
    },
  })
);

const PulsingIcon = styled(FiberManualRecordIcon)<{ statuscolor: string }>(
  ({ theme, statuscolor }) => ({
    fontSize: "0.8rem",
    color: statuscolor,
    animation: "pulse 2s infinite",
    "@keyframes pulse": {
      "0%": {
        opacity: 1,
      },
      "50%": {
        opacity: 0.5,
      },
      "100%": {
        opacity: 1,
      },
    },
  })
);

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = "small",
  showIcon = true,
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "connected":
        return {
          color: "#10b981",
          label: label || "연결됨",
          isPulsing: true,
        };
      case "starting":
        return {
          color: "#f59e0b",
          label: label || "시작 중",
          isPulsing: true,
        };
      case "running":
        return {
          color: "#3b82f6",
          label: label || "실행 중",
          isPulsing: true,
        };
      case "completed":
        return {
          color: "#10b981",
          label: label || "완료",
          isPulsing: false,
        };
      case "failed":
        return {
          color: "#ef4444",
          label: label || "실패",
          isPulsing: false,
        };
      case "error":
        return {
          color: "#ef4444",
          label: label || "오류",
          isPulsing: false,
        };
      case "disconnected":
        return {
          color: "#6b7280",
          label: label || "연결 해제",
          isPulsing: false,
        };
      default:
        return {
          color: "#6b7280",
          label: label || "알 수 없음",
          isPulsing: false,
        };
    }
  };

  const config = getStatusConfig(status);

  const icon = showIcon ? (
    config.isPulsing ? (
      <PulsingIcon statuscolor={config.color} />
    ) : (
      <FiberManualRecordIcon sx={{ fontSize: "0.8rem", color: config.color }} />
    )
  ) : undefined;

  return (
    <StyledChip
      icon={icon}
      label={config.label}
      size={size}
      statuscolor={config.color}
      variant="outlined"
    />
  );
};

export default StatusBadge;
