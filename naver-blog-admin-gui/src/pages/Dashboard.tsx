import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Container,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  Chip,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ArticleIcon from "@mui/icons-material/Article";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import MonitorIcon from "@mui/icons-material/Monitor";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LicenseIcon from "@mui/icons-material/VpnKey";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PendingIcon from "@mui/icons-material/Pending";

import ModernCard from "../components/common/ModernCard";
import RealTimeMonitor from "../components/Dashboard/RealTimeMonitor";
import WebSocketStatus from "../components/Dashboard/WebSocketStatus";
import PurchaseManagement from "../components/Dashboard/PurchaseManagement";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useWebSocket } from "../hooks/useWebSocket";

// 🆕 강의 아이디어: 더 현실적인 샘플 데이터
const dummyStats = {
  totalUsers: 42,
  activeUsers: 8,
  totalPosts: 156,
  successfulPosts: 142,
  failedPosts: 14,
  successRate: 91,
  todayRevenue: 850000,
  monthlyRevenue: 12450000,
  activeLicenses: 38,
  expiringSoon: 5,
};

// 🆕 강의 아이디어: 라이선스 상태별 데이터
const licenseStatusData = {
  active: 38,
  pending: 4,
  expired: 8,
  total: 50,
};

// 🆕 강의 아이디어: 더 상세한 사용자 활동 데이터
const dummyUserSummaries = [
  {
    userId: "user1",
    userName: "김철수",
    email: "kimcs@example.com",
    postsToday: 15,
    successRate: 100,
    lastActivity: "2분 전",
    status: "작업중",
    progress: 80,
    message: "네이버 블로그 자동 포스팅 진행 중 (12/15)",
    licenseExpiry: "2025-08-10",
    revenue: 99000,
  },
  {
    userId: "user2",
    userName: "이영희",
    email: "leeyh@example.com",
    postsToday: 8,
    successRate: 87,
    lastActivity: "10분 전",
    status: "대기중",
    progress: 45,
    message: "Google Sheets 연동 대기 중",
    licenseExpiry: "2025-12-15",
    revenue: 149000,
  },
  {
    userId: "user3",
    userName: "박민수",
    email: "parkms@example.com",
    postsToday: 22,
    successRate: 95,
    lastActivity: "방금 전",
    status: "완료",
    progress: 100,
    message: "오늘 목표량 달성! 🎉",
    licenseExpiry: "2025-07-20",
    revenue: 199000,
  },
];

const DashboardContainer = styled(Container)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  minHeight: "100vh",
  padding: theme.spacing(3),
  color: "#ffffff",
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: "center",
}));

const StatsGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const ConnectionStatusHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  background: "rgba(255, 255, 255, 0.02)",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
}));

const StatusIndicator = styled(Box)<{ connected: boolean }>(
  ({ theme, connected }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
    borderRadius: "20px",
    background: connected
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    boxShadow: connected
      ? "0 4px 15px rgba(16, 185, 129, 0.3)"
      : "0 4px 15px rgba(239, 68, 68, 0.3)",
    animation: connected ? "none" : "pulse 2s infinite",
    "@keyframes pulse": {
      "0%": {
        boxShadow: connected
          ? "0 4px 15px rgba(16, 185, 129, 0.3)"
          : "0 4px 15px rgba(239, 68, 68, 0.3)",
      },
      "50%": {
        boxShadow: connected
          ? "0 8px 25px rgba(16, 185, 129, 0.5)"
          : "0 8px 25px rgba(239, 68, 68, 0.5)",
      },
      "100%": {
        boxShadow: connected
          ? "0 4px 15px rgba(16, 185, 129, 0.3)"
          : "0 4px 15px rgba(239, 68, 68, 0.3)",
      },
    },
  })
);

// 🆕 강의 아이디어: 매출 카드 컴포넌트
const RevenueCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

// 🆕 강의 아이디어: 상태 필터 칩
const StatusFilterChip = styled(Chip)<{ active: boolean }>(
  ({ theme, active }) => ({
    margin: theme.spacing(0.5),
    backgroundColor: active
      ? theme.palette.primary.main
      : "rgba(255, 255, 255, 0.1)",
    color: active ? "white" : "rgba(255, 255, 255, 0.7)",
    borderColor: active
      ? theme.palette.primary.main
      : "rgba(255, 255, 255, 0.3)",
    "&:hover": {
      backgroundColor: active
        ? theme.palette.primary.dark
        : "rgba(255, 255, 255, 0.2)",
    },
  })
);

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const [currentTab, setCurrentTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "대시보드", icon: <DashboardIcon /> },
    { id: "revenue", label: "매출 현황", icon: <MonetizationOnIcon /> },
    { id: "licenses", label: "라이선스 관리", icon: <LicenseIcon /> },
    { id: "purchases", label: "구매/라이선스", icon: <PeopleIcon /> },
    { id: "monitor", label: "실시간 모니터링", icon: <MonitorIcon /> },
  ];

  // WebSocket 연결 복원
  const {
    isConnected,
    connectionStatus,
    lastMessage,
    userActivities,
    sendMessage,
    connect,
    disconnect,
  } = useWebSocket({
    url: "ws://localhost:8000/ws/admin",
    onMessage: (message) => {
      console.log("📨 Dashboard 메시지 수신:", message);

      if (message.type === "user_activity") {
        const userName =
          message.data?.user_name ||
          `사용자 ${message.data?.user_id?.slice(-4)}`;
        const activityMessage = getActivityMessage(
          message.data?.activity,
          userName
        );

        setNotification({
          open: true,
          message: activityMessage,
          severity: "info",
        });
      } else if (message.type === "purchase_complete") {
        setNotification({
          open: true,
          message: `💰 새 구매 완료! ${message.data?.customer_name}님이 ${message.data?.product}를 구매하셨습니다.`,
          severity: "success",
        });
      } else if (message.type === "license_activated") {
        setNotification({
          open: true,
          message: `🔑 라이선스 활성화! ${message.data?.user_name}님의 라이선스가 활성화되었습니다.`,
          severity: "success",
        });
      }
    },
    onConnect: () => {
      console.log("✅ Dashboard WebSocket 연결 성공");
      setNotification({
        open: true,
        message:
          "🟢 실시간 모니터링이 시작되었습니다! 모든 활동을 실시간으로 확인할 수 있습니다.",
        severity: "success",
      });
    },
    onDisconnect: () => {
      console.log("🔌 Dashboard WebSocket 연결 해제");
      setNotification({
        open: true,
        message:
          "🔴 실시간 모니터링 연결이 일시적으로 중단되었습니다. 자동으로 재연결을 시도합니다.",
        severity: "warning",
      });
    },
    onError: (error) => {
      console.error("❌ Dashboard WebSocket 오류:", error);
      setNotification({
        open: true,
        message:
          "⚠️ 네트워크 문제로 실시간 모니터링에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        severity: "error",
      });
    },
    autoReconnect: true,
    reconnectInterval: 5000,
  });

  const getActivityMessage = (activity: string, userName: string): string => {
    switch (activity) {
      case "post_created":
        return `✍️ ${userName}님이 새 글을 작성했습니다!`;
      case "post_published":
        return `📝 ${userName}님이 글을 발행했습니다!`;
      case "login":
        return `👋 ${userName}님이 로그인했습니다.`;
      case "logout":
        return `👋 ${userName}님이 로그아웃했습니다.`;
      case "automation_started":
        return `🚀 ${userName}님이 자동화를 시작했습니다!`;
      case "automation_completed":
        return `🎉 ${userName}님의 자동화가 완료되었습니다!`;
      case "error_occurred":
        return `⚠️ ${userName}님에게 오류가 발생했습니다. 지원이 필요할 수 있습니다.`;
      default:
        return `📊 ${userName}님이 활동 중입니다.`;
    }
  };

  const getFilteredUserSummaries = () => {
    if (statusFilter === "all") return dummyUserSummaries;
    return dummyUserSummaries.filter((user) => {
      switch (statusFilter) {
        case "active":
          return user.status === "작업중";
        case "completed":
          return user.status === "완료";
        case "waiting":
          return user.status === "대기중";
        case "expiring":
          return (
            new Date(user.licenseExpiry) <=
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          );
        default:
          return true;
      }
    });
  };

  const stats = {
    totalUsers: userActivities.length || dummyStats.totalUsers,
    activeUsers:
      userActivities.filter((u) => u.status === "running").length ||
      dummyStats.activeUsers,
    totalPosts:
      userActivities.reduce((sum, u) => sum + (u.progress || 0), 0) ||
      dummyStats.totalPosts,
    successfulPosts:
      userActivities.filter((u) => u.status === "completed").length ||
      dummyStats.successfulPosts,
    failedPosts:
      userActivities.filter((u) => u.status === "failed").length ||
      dummyStats.failedPosts,
    successRate: userActivities.length
      ? Math.round(
          (userActivities.filter((u) => u.status === "completed").length /
            userActivities.length) *
            100
        )
      : dummyStats.successRate,
    todayRevenue: dummyStats.todayRevenue,
    monthlyRevenue: dummyStats.monthlyRevenue,
    activeLicenses: dummyStats.activeLicenses,
    expiringSoon: dummyStats.expiringSoon,
  };

  const userSummaries =
    userActivities.length > 0
      ? userActivities.map((activity) => ({
          userId: activity.user_id,
          userName: `사용자 ${activity.user_id.slice(-4)}`,
          email: `user${activity.user_id.slice(-4)}@example.com`,
          postsToday: activity.progress || 0,
          successRate:
            activity.status === "completed"
              ? 100
              : activity.status === "failed"
                ? 0
                : 50,
          lastActivity: "방금 전",
          status:
            activity.status === "running"
              ? "작업중"
              : activity.status === "completed"
                ? "완료"
                : "대기중",
          progress: activity.progress || 0,
          message: activity.message || "활동 중...",
          licenseExpiry: "2025-12-31",
          revenue: Math.floor(Math.random() * 200000) + 50000,
        }))
      : dummyUserSummaries;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLastUpdate(new Date().toLocaleString("ko-KR"));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefreshStats = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date().toLocaleString("ko-KR"));
      setIsLoading(false);
      setNotification({
        open: true,
        message:
          "📊 최신 데이터로 업데이트되었습니다! 모든 통계가 실시간으로 반영되었습니다.",
        severity: "success",
      });
    }, 800);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleStatusFilterChange = (newFilter: string) => {
    setStatusFilter(newFilter);
    setNotification({
      open: true,
      message: `🔍 ${getFilterLabel(newFilter)} 사용자만 표시합니다.`,
      severity: "info",
    });
  };

  const getFilterLabel = (filter: string): string => {
    switch (filter) {
      case "all":
        return "전체";
      case "active":
        return "활성";
      case "completed":
        return "완료";
      case "waiting":
        return "대기중";
      case "expiring":
        return "만료 예정";
      default:
        return "전체";
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="최신 데이터를 불러오는 중입니다..." />;
  }

  return (
    <DashboardContainer maxWidth="xl">
      <HeaderSection>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          mb={2}
        >
          <DashboardIcon sx={{ fontSize: "2.5rem", color: "#3b82f6" }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            네이버블로그 자동화 관리센터
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 400,
          }}
        >
          고객님들의 블로그 자동화 현황을 실시간으로 모니터링하고 관리하세요
        </Typography>
        {lastUpdate && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={1}
          >
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              마지막 업데이트: {lastUpdate}
            </Typography>
            <Tooltip title="데이터 새로고침">
              <IconButton
                onClick={handleRefreshStats}
                size="small"
                sx={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </HeaderSection>

      <ConnectionStatusHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
            실시간 시스템 상태
          </Typography>
          <StatusIndicator connected={Boolean(isConnected)}>
            <FiberManualRecordIcon
              sx={{ fontSize: "12px", color: "#ffffff" }}
            />
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontWeight: 600 }}
            >
              {isConnected ? "모든 시스템 정상 동작" : "연결 확인 중..."}
            </Typography>
          </StatusIndicator>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {isConnected ? (
            <Box display="flex" alignItems="center" gap={1}>
              <WifiIcon sx={{ color: "#10b981", fontSize: "24px" }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#10b981",
                  fontWeight: 600,
                }}
              >
                실시간 모니터링 활성
              </Typography>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              <WifiOffIcon sx={{ color: "#ef4444", fontSize: "24px" }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#ef4444",
                  fontWeight: 600,
                }}
              >
                연결 재시도 중...
              </Typography>
            </Box>
          )}
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefreshStats}
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.3)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            업데이트
          </Button>
        </Box>
      </ConnectionStatusHeader>

      <Box mb={3}>
        <WebSocketStatus
          status={connectionStatus}
          onReconnect={() => {
            connect();
            setNotification({
              open: true,
              message:
                "🔄 실시간 연결을 다시 시도하고 있습니다. 잠시만 기다려주세요...",
              severity: "info",
            });
          }}
          lastConnected={isConnected ? new Date().toISOString() : undefined}
        />
      </Box>

      <Box
        sx={{ borderBottom: 1, borderColor: "rgba(255, 255, 255, 0.2)", mb: 3 }}
      >
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              color: "rgba(255, 255, 255, 0.7)",
              minHeight: 64,
              textTransform: "none",
              fontSize: "1rem",
              "&.Mui-selected": {
                color: "#3b82f6",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#3b82f6",
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {tab.icon}
                  {tab.label}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        {currentTab === "dashboard" && (
          <>
            <Grid container spacing={3} sx={{ marginBottom: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernCard
                  title="전체 고객"
                  value={stats.totalUsers}
                  subtitle="등록된 전체 고객 수"
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  icon={
                    <PeopleIcon sx={{ color: "rgba(255, 255, 255, 0.9)" }} />
                  }
                  onRefresh={handleRefreshStats}
                  loading={isLoading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernCard
                  title="현재 활성 사용자"
                  value={stats.activeUsers}
                  subtitle="지금 자동화 작업 중"
                  gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                  icon={<WifiIcon sx={{ color: "rgba(255, 255, 255, 0.9)" }} />}
                  onRefresh={handleRefreshStats}
                  loading={isLoading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernCard
                  title="오늘 작성된 글"
                  value={stats.totalPosts}
                  subtitle="전체 고객이 작성한 포스트"
                  gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                  icon={
                    <ArticleIcon sx={{ color: "rgba(255, 255, 255, 0.9)" }} />
                  }
                  onRefresh={handleRefreshStats}
                  loading={isLoading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernCard
                  title="자동화 성공률"
                  value={`${stats.successRate}%`}
                  subtitle={`성공: ${stats.successfulPosts} | 오류: ${stats.failedPosts}`}
                  gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
                  icon={
                    <TrendingUpIcon
                      sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                    />
                  }
                  onRefresh={handleRefreshStats}
                  loading={isLoading}
                />
              </Grid>
            </Grid>

            <Paper
              sx={{
                p: 3,
                mb: 3,
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <FilterListIcon sx={{ color: "#3b82f6" }} />
                <Typography
                  variant="h6"
                  sx={{ color: "#ffffff", fontWeight: 600 }}
                >
                  고객 현황 필터
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {[
                  {
                    key: "all",
                    label: "전체",
                    icon: <PeopleIcon fontSize="small" />,
                  },
                  {
                    key: "active",
                    label: "작업 중",
                    icon: <NotificationsActiveIcon fontSize="small" />,
                  },
                  {
                    key: "completed",
                    label: "완료",
                    icon: <CheckCircleIcon fontSize="small" />,
                  },
                  {
                    key: "waiting",
                    label: "대기 중",
                    icon: <PendingIcon fontSize="small" />,
                  },
                  {
                    key: "expiring",
                    label: "만료 예정",
                    icon: <ErrorIcon fontSize="small" />,
                  },
                ].map((filter) => (
                  <StatusFilterChip
                    key={filter.key}
                    icon={filter.icon}
                    label={filter.label}
                    active={statusFilter === filter.key}
                    onClick={() => handleStatusFilterChange(filter.key)}
                    variant={
                      statusFilter === filter.key ? "filled" : "outlined"
                    }
                  />
                ))}
              </Box>
            </Paper>

            <Paper
              sx={{
                p: 3,
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justify-content="space-between"
                mb={3}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#ffffff", fontWeight: 600 }}
                >
                  실시간 고객 활동 현황 ({getFilterLabel(statusFilter)})
                </Typography>
                <Chip
                  label={`${getFilteredUserSummaries().length}명`}
                  variant="outlined"
                  sx={{ color: "#3b82f6", borderColor: "#3b82f6" }}
                />
              </Box>

              <Grid container spacing={2}>
                {getFilteredUserSummaries().map((user) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={user.userId}>
                    <Card
                      sx={{
                        background:
                          "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          alignItems="center"
                          justify-content="space-between"
                          mb={2}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ color: "#ffffff", fontWeight: 600 }}
                            >
                              {user.userName}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                            >
                              {user.email}
                            </Typography>
                          </Box>
                          <Chip
                            label={user.status}
                            size="small"
                            sx={{
                              backgroundColor:
                                user.status === "작업중"
                                  ? "#10b981"
                                  : user.status === "완료"
                                    ? "#3b82f6"
                                    : "#f59e0b",
                              color: "white",
                            }}
                          />
                        </Box>

                        <Box mb={2}>
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1 }}
                          >
                            {user.message}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={user.progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#3b82f6",
                                borderRadius: 4,
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                          >
                            진행률: {user.progress}%
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          justify-content="space-between"
                          align-items="center"
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                            >
                              오늘 작성: {user.postsToday}개
                            </Typography>
                            <br />
                            <Typography
                              variant="caption"
                              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                            >
                              성공률: {user.successRate}%
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography
                              variant="caption"
                              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                            >
                              매출: ₩{user.revenue.toLocaleString()}
                            </Typography>
                            <br />
                            <Typography
                              variant="caption"
                              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                            >
                              {user.lastActivity}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {getFilteredUserSummaries().length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography
                    variant="h6"
                    sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                  >
                    해당 조건에 맞는 사용자가 없습니다.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.3)" }}
                  >
                    다른 필터를 선택해보세요.
                  </Typography>
                </Box>
              )}
            </Paper>
          </>
        )}

        {currentTab === "revenue" && (
          <>
            <Grid container spacing={3} sx={{ marginBottom: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <RevenueCard>
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justify-content="space-between"
                      mb={2}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        오늘 매출
                      </Typography>
                      <MonetizationOnIcon />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      ₩{stats.todayRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      전일 대비 +12.5% 증가
                    </Typography>
                  </CardContent>
                </RevenueCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <RevenueCard>
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justify-content="space-between"
                      mb={2}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        이번 달 매출
                      </Typography>
                      <TrendingUpIcon />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      ₩{stats.monthlyRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      월 목표 대비 87% 달성
                    </Typography>
                  </CardContent>
                </RevenueCard>
              </Grid>
            </Grid>

            <Paper
              sx={{
                p: 3,
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", fontWeight: 600, mb: 3 }}
              >
                매출 기여 고객 현황
              </Typography>

              <Grid container spacing={2}>
                {dummyUserSummaries
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((user, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.userId}>
                      <Card
                        sx={{
                          background:
                            index === 0
                              ? "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)"
                              : index === 1
                                ? "linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)"
                                : index === 2
                                  ? "linear-gradient(135deg, #cd7f32 0%, #deb887 100%)"
                                  : "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          color: index < 3 ? "#000" : "#fff",
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            alignItems="center"
                            justify-content="space-between"
                            mb={2}
                          >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {index + 1}. {user.userName}
                            </Typography>
                            {index === 0 && <Typography>🥇</Typography>}
                            {index === 1 && <Typography>🥈</Typography>}
                            {index === 2 && <Typography>🥉</Typography>}
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, mb: 1 }}
                          >
                            ₩{user.revenue.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            라이선스 만료: {user.licenseExpiry}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Paper>
          </>
        )}

        {currentTab === "licenses" && (
          <>
            <Grid container spacing={3} sx={{ marginBottom: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernCard
                  title="활성 라이선스"
                  value={licenseStatusData.active}
                  subtitle="현재 사용 중인 라이선스"
                  gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  icon={
                    <CheckCircleIcon
                      sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                    />
                  }
                  onRefresh={handleRefreshStats}
                  loading={isLoading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernCard
                  title="대기 중"
                  value={licenseStatusData.pending}
                  subtitle="활성화 대기 중인 라이선스"
                  gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  icon={
                    <PendingIcon sx={{ color: "rgba(255, 255, 255, 0.9)" }} />
                  }
                  onRefresh={handleRefreshStats}
                  loading={isLoading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernCard
                  title="만료됨"
                  value={licenseStatusData.expired}
                  subtitle="만료된 라이선스"
                  gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                  icon={
                    <ErrorIcon sx={{ color: "rgba(255, 255, 255, 0.9)" }} />
                  }
                  onRefresh={handleRefreshStats}
                  loading={isLoading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernCard
                  title="만료 예정"
                  value={stats.expiringSoon}
                  subtitle="30일 내 만료 예정"
                  gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                  icon={
                    <NotificationsActiveIcon
                      sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                    />
                  }
                  onRefresh={handleRefreshStats}
                  loading={isLoading}
                />
              </Grid>
            </Grid>
          </>
        )}

        {currentTab === "purchases" && <PurchaseManagement />}

        {currentTab === "monitor" && (
          <RealTimeMonitor
            userSummaries={userSummaries}
            onRefresh={handleRefreshStats}
          />
        )}
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </DashboardContainer>
  );
};

export default Dashboard;
