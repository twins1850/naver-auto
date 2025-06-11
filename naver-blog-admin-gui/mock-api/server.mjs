import express from "express";
import cors from "cors";
import crypto from "crypto";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5175",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// CSRF 토큰 생성
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// 액세스 토큰 생성
const generateAccessToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// 리프레시 토큰 생성
const generateRefreshToken = () => {
  return crypto.randomBytes(48).toString("hex");
};

// 테스트용 사용자 데이터
const testUser = {
  id: 1,
  email: "admin@example.com",
  username: "관리자",
  role: "admin",
  permissions: [
    "manage_licenses",
    "manage_users",
    "manage_notices",
    "view_dashboard",
    "manage_updates",
  ],
};

// 토큰 저장소
const tokenStore = new Map();

// CSRF 토큰 발급
app.get("/auth/csrf-token", (req, res) => {
  const csrfToken = generateCSRFToken();
  res.json({
    success: true,
    data: { csrfToken },
  });
});

// 로그인 API
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const csrfToken = req.headers["x-csrf-token"];

  if (!csrfToken) {
    return res.status(403).json({
      success: false,
      message: "CSRF 토큰이 누락되었습니다.",
    });
  }

  if (email === "admin@example.com" && password === "admin123") {
    const accessToken = generateAccessToken();
    const refreshToken = generateRefreshToken();

    // 토큰 저장
    tokenStore.set(refreshToken, {
      userId: testUser.id,
      accessToken,
      createdAt: Date.now(),
    });

    // 쿠키에 리프레시 토큰 설정
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    res.json({
      success: true,
      data: {
        token: accessToken,
        user: testUser,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "이메일 또는 비밀번호가 올바르지 않습니다.",
    });
  }
});

// 토큰 갱신 API
app.post("/auth/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken || !tokenStore.has(refreshToken)) {
    return res.status(401).json({
      success: false,
      message: "유효하지 않은 리프레시 토큰입니다.",
    });
  }

  const tokenData = tokenStore.get(refreshToken);
  const newAccessToken = generateAccessToken();

  // 토큰 정보 업데이트
  tokenStore.set(refreshToken, {
    ...tokenData,
    accessToken: newAccessToken,
  });

  res.json({
    success: true,
    data: {
      token: newAccessToken,
    },
  });
});

// 로그아웃 API
app.post("/auth/logout", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    tokenStore.delete(refreshToken);
  }

  res.clearCookie("refreshToken");
  res.json({
    success: true,
    message: "로그아웃되었습니다.",
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Mock API server is running on port ${PORT}`);
});
