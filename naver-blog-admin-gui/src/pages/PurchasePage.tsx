import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import PurchaseCreate from "../components/common/PurchaseCreate";
import LicenseActivate from "../components/common/LicenseActivate";
import LicenseValidate from "../components/common/LicenseValidate";
import PurchaseManagement from "../components/Dashboard/PurchaseManagement";

const PurchasePage: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 3,
      }}
    >
      <Paper
        sx={{
          maxWidth: 1200,
          margin: "auto",
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* 헤더 */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 3,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#ffffff",
              fontWeight: "bold",
              textAlign: "center",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            🛒 구매/라이선스 관리 (동적 가격 정책)
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              textAlign: "center",
              mt: 1,
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            네이버 블로그 자동화 프로그램 동적 버전별 구매 및 라이선스 관리
          </Typography>
        </Box>

        {/* 탭 네비게이션 */}
        <Box
          sx={{
            borderBottom: "1px solid #e0e0e0",
            background: "#f8f9fa",
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            centered
            sx={{
              "& .MuiTab-root": {
                color: "#495057",
                fontSize: "1rem",
                fontWeight: "600",
                minHeight: "64px",
                "&.Mui-selected": {
                  color: "#667eea",
                  fontWeight: "bold",
                },
                "&:hover": {
                  color: "#667eea",
                  backgroundColor: "rgba(102, 126, 234, 0.05)",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#667eea",
                height: 3,
              },
            }}
          >
            <Tab label="🛒 구매 생성" />
            <Tab label="🔑 라이선스 활성화" />
            <Tab label="🔍 라이선스 검증" />
            <Tab label="📊 구매 관리" />
          </Tabs>
        </Box>

        {/* 탭 콘텐츠 */}
        <Box sx={{ p: 3, backgroundColor: "#ffffff" }}>
          {tab === 0 && <PurchaseCreate />}
          {tab === 1 && <LicenseActivate />}
          {tab === 2 && <LicenseValidate />}
          {tab === 3 && <PurchaseManagement />}
        </Box>
      </Paper>
    </Box>
  );
};

export default PurchasePage;
