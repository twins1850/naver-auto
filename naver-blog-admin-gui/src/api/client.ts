import axios from "axios";
import { useAuthStore } from "../store";

// API 기본 설정
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Axios 인스턴스 생성
export const client = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // CORS 충돌 해결을 위해 false로 변경
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// 요청 인터셉터
client.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 헤더에 추가
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshed = await useAuthStore.getState().refreshToken();
        if (refreshed) {
          const token = localStorage.getItem("token");
          processQueue(null, token);
          return client(originalRequest);
        } else {
          processQueue(error, null);
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      // 서버 응답이 있는 경우
      switch (error.response.status) {
        case 403:
          // 권한 에러 처리
          console.error("접근 권한이 없습니다.");
          break;
        case 500:
          // 서버 에러 처리
          console.error("서버 에러가 발생했습니다.");
          break;
        default:
          console.error("API 요청 중 에러가 발생했습니다.");
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error("서버로부터 응답을 받지 못했습니다.");
    } else {
      // 요청 자체를 보내지 못한 경우
      console.error("API 요청 중 에러가 발생했습니다:", error.message);
    }
    return Promise.reject(error);
  }
);
