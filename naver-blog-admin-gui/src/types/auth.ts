export type Permission =
  | "manage_licenses"
  | "manage_users"
  | "manage_notices"
  | "view_dashboard"
  | "manage_updates";

export type Role = "admin" | "manager" | "viewer";

export interface UserPermissions {
  role: Role;
  permissions: Permission[];
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: Role;
  permissions: Permission[];
}

export const DEFAULT_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "manage_licenses",
    "manage_users",
    "manage_notices",
    "view_dashboard",
    "manage_updates",
  ],
  manager: ["manage_licenses", "manage_notices", "view_dashboard"],
  viewer: ["view_dashboard"],
};
