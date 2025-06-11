// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    CSRF_TOKEN: "/auth/csrf-token",
    ME: "/auth/me",
  },

  // 공지사항
  NOTICES: {
    LIST: "/notices",
    DETAIL: (id: number) => `/notices/${id}`,
    CREATE: "/notices",
    UPDATE: (id: number) => `/notices/${id}`,
    DELETE: (id: number) => `/notices/${id}`,
  },

  // 라이선스
  LICENSES: {
    LIST: "/licenses",
    DETAIL: (id: number) => `/licenses/${id}`,
    CREATE: "/licenses",
    UPDATE: (id: number) => `/licenses/${id}`,
    DELETE: (id: number) => `/licenses/${id}`,
    ACTIVATE: (id: number) => `/licenses/${id}/activate`,
    DEACTIVATE: (id: number) => `/licenses/${id}/deactivate`,
  },

  // 사용자
  USERS: {
    LIST: "/users",
    DETAIL: (id: number) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    ACTIVATE: (id: number) => `/users/${id}/activate`,
    DEACTIVATE: (id: number) => `/users/${id}/deactivate`,
  },

  // 통계
  STATS: {
    DASHBOARD: "/stats/dashboard",
    USERS: "/stats/users",
    LICENSES: "/stats/licenses",
    USAGE: "/stats/usage",
  },
} as const;
