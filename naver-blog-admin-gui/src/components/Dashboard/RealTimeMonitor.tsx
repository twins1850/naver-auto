import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  LinearProgress,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StatusBadge from "../common/StatusBadge";
import type { UserSummary } from "../../hooks/useRealTimeStats";

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: theme.spacing(3),
  height: "500px",
  overflow: "hidden",
}));

const ScrollableList = styled(List)(({ theme }) => ({
  maxHeight: "400px",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.3)",
    borderRadius: "10px",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.5)",
    },
  },
}));

const UserListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: "12px",
  marginBottom: theme.spacing(1),
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: "translateX(4px)",
  },
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const TimeChip = styled(Chip)(({ theme }) => ({
  fontSize: "0.7rem",
  height: "20px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "rgba(255, 255, 255, 0.8)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
}));

export interface RealTimeMonitorProps {
  userSummaries: UserSummary[];
  title?: string;
  onRefresh?: () => void;
}

const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({
  userSummaries,
  title = "실시간 사용자 활동",
}) => {
  const formatTime = (timestamp: string): string => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "방금 전";
    if (diffMinutes < 60) return `${diffMinutes}분 전`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  };

  const getProgressColor = (status: string): string => {
    switch (status) {
      case "running":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "failed":
      case "error":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getUserAvatar = (userId: string): string => {
    // 사용자 ID를 기반으로 고유한 색상 생성
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#ffeaa7",
      "#dda0dd",
    ];
    const index =
      userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  return (
    <StyledPaper elevation={0}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <PersonIcon sx={{ color: "rgba(255, 255, 255, 0.8)" }} />
        <Typography
          variant="h6"
          sx={{
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "1.2rem",
          }}
        >
          {title}
        </Typography>
        <Chip
          label={`${userSummaries.length}명`}
          size="small"
          sx={{
            ml: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            fontWeight: 600,
          }}
        />
      </Box>

      <Divider sx={{ mb: 2, backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

      {userSummaries.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="300px"
          sx={{ color: "rgba(255, 255, 255, 0.6)" }}
        >
          <PersonIcon sx={{ fontSize: "4rem", mb: 2, opacity: 0.3 }} />
          <Typography variant="h6" sx={{ opacity: 0.7 }}>
            활성 사용자가 없습니다
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            사용자가 연결되면 여기에 표시됩니다
          </Typography>
        </Box>
      ) : (
        <ScrollableList>
          {userSummaries.map((user, index) => (
            <UserListItem
              key={user.userId}
              divider={index < userSummaries.length - 1}
            >
              <Avatar
                sx={{
                  bgcolor: getUserAvatar(user.userId),
                  width: 40,
                  height: 40,
                  mr: 2,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                {user.userId.slice(0, 2).toUpperCase()}
              </Avatar>

              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      {user.userId}
                    </Typography>
                    <StatusBadge status={user.status as any} size="small" />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "0.8rem",
                        mb: 1,
                      }}
                    >
                      {user.message}
                    </Typography>

                    {user.progress > 0 && (
                      <ProgressContainer>
                        <LinearProgress
                          variant="determinate"
                          value={user.progress}
                          sx={{
                            flex: 1,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: getProgressColor(user.status),
                              borderRadius: 3,
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            minWidth: "35px",
                          }}
                        >
                          {user.progress}%
                        </Typography>
                      </ProgressContainer>
                    )}
                  </Box>
                }
              />

              <ListItemSecondaryAction>
                <TimeChip
                  icon={<AccessTimeIcon sx={{ fontSize: "0.7rem" }} />}
                  label={formatTime(user.lastActivity)}
                  size="small"
                  variant="outlined"
                />
              </ListItemSecondaryAction>
            </UserListItem>
          ))}
        </ScrollableList>
      )}
    </StyledPaper>
  );
};

export default RealTimeMonitor;
