import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store";
import LoadingSpinner from "../common/LoadingSpinner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 토큰은 있는데 user 정보가 아직 null이면 로딩 표시
  if (isAuthenticated && !user) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
