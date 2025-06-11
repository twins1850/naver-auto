import React from "react";
import { useAuthStore } from "../../store";
import { Permission } from "../../types/auth";
import { Typography } from "@mui/material";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: Permission;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  fallback,
}) => {
  const { user } = useAuthStore();

  if (!user || !user.permissions.includes(requiredPermission)) {
    return (
      fallback || (
        <Typography color="error" align="center">
          이 기능에 대한 접근 권한이 없습니다.
        </Typography>
      )
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
