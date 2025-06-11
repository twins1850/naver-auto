import React, { useEffect, Suspense } from "react";
import LoginPage from "./pages/LoginPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  Button,
  CircularProgress,
} from "@mui/material";
import { useAuthStore } from "./store";

// Lazy loading으로 페이지 컴포넌트들 분할
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const PurchasePage = React.lazy(() => import("./pages/PurchasePage"));
const UserPage = React.lazy(() => import("./pages/UserPage"));
const NoticePage = React.lazy(() => import("./pages/NoticePage"));

const drawerWidth = 220;

const menuItems = [
  {
    label: "대시보드",
    to: "/",
    permission: "view_dashboard",
  },
  {
    label: "구매/라이선스 관리",
    to: "/purchases",
    permission: "manage_licenses",
  },
  {
    label: "사용자 관리",
    to: "/users",
    permission: "manage_users",
  },
  {
    label: "공지사항 관리",
    to: "/notices",
    permission: "manage_notices",
  },
];

// 로딩 컴포넌트
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    <CircularProgress size={40} />
  </Box>
);

const AdminLayout = () => {
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            네이버 블로그 관리자 시스템
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="inherit">
              {user?.email || "관리자"}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              variant="outlined"
              size="small"
            >
              로그아웃
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem disablePadding key={item.to}>
              <ListItemButton component={Link} to={item.to}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/purchases" element={<PurchasePage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/notices" element={<NoticePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
};

// 인증 보호 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token } = useAuthStore();

  // 토큰이 있으면 인증된 것으로 간주
  if (token && isAuthenticated) {
    return <>{children}</>;
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  return <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated, token } = useAuthStore();

  // 초기 토큰 확인 및 인증 상태 동기화
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    console.log("🔍 App 초기화 - 저장된 토큰:", !!savedToken);
    console.log("🔍 현재 인증 상태:", { isAuthenticated, token: !!token });

    if (savedToken && !isAuthenticated) {
      console.log("🔄 토큰이 있지만 인증 상태가 false - 상태 동기화");
      // 토큰이 있지만 인증 상태가 false인 경우 동기화
      useAuthStore.setState({
        isAuthenticated: true,
        token: savedToken,
        user: {
          id: 1,
          email: "yegreen2010@gmail.com", // 임시 사용자 정보
          username: "yegreen2010",
          role: "admin",
          permissions: [
            "view_dashboard",
            "manage_licenses",
            "manage_users",
            "manage_notices",
          ],
        },
      });
    }
  }, [isAuthenticated, token]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            // 이미 로그인된 경우 대시보드로 리다이렉트
            token && isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
