// 공통 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// 공지사항 타입
export interface Notice {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// 라이선스 타입
export interface License {
  id: number;
  key: string;
  user_id: number;
  status: "active" | "inactive" | "expired";
  created_at: string;
  expires_at: string;
  last_used_at?: string;
}

// 사용자 타입
export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  license?: License;
}

// 통계 데이터 타입
export interface Stats {
  total_users: number;
  active_users: number;
  total_licenses: number;
  active_licenses: number;
  usage_stats: {
    date: string;
    count: number;
  }[];
}
