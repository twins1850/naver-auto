import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Alert,
} from "@mui/material";
import { activateLicense } from "../../api/purchase";

const LicenseActivate: React.FC = () => {
  const [activationData, setActivationData] = useState({
    temporary_license: "",
    hardware_id: "",
  });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activationResult, setActivationResult] = useState<any>(null);

  const handleActivate = async () => {
    if (!activationData.temporary_license || !activationData.hardware_id) {
      setResult("임시 라이선스와 하드웨어 ID를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await activateLicense(activationData);
      setActivationResult(res);

      // 🆕 Google Sheets 자동 업데이트 상태 표시
      if (res.success) {
        let message = "✅ 라이선스가 성공적으로 활성화되었습니다!";

        if (res.googleSheetsUpdated) {
          message += "\n🔄 Google Sheets가 자동으로 업데이트되었습니다.";
        } else if (res.warning) {
          message += `\n⚠️ ${res.warning}`;
        }

        setResult(message);
      } else {
        setResult("❌ 활성화 실패: " + (res.message || "알 수 없는 오류"));
      }
    } catch (e: any) {
      setResult(
        "❌ 활성화 실패: " +
          (e?.response?.data?.message || e?.message || "오류")
      );
    }
    setLoading(false);
  };

  const generateTestHardwareId = () => {
    const randomId =
      "HW-" + Math.random().toString(36).substring(2, 15).toUpperCase();
    setActivationData((prev) => ({ ...prev, hardware_id: randomId }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography
        variant="h5"
        sx={{
          color: "#2c3e50",
          mb: 2,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        🔑 라이선스 활성화 (동적 버전 기반)
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: "#ffffff",
              border: "2px solid #e8f5e8",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#2e7d32",
                  mb: 2,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                🔐 활성화 정보 입력
              </Typography>

              <TextField
                fullWidth
                label="임시 라이선스 (구매 완료 후 받은 토큰)"
                value={activationData.temporary_license}
                onChange={(e) =>
                  setActivationData((prev) => ({
                    ...prev,
                    temporary_license: e.target.value,
                  }))
                }
                multiline
                rows={4}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fafafa",
                    color: "#2c3e50",
                  },
                }}
                placeholder="TMP-ABC123DEF456..."
              />

              <Box display="flex" gap={1} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="하드웨어 ID (컴퓨터 고유 식별자)"
                  value={activationData.hardware_id}
                  onChange={(e) =>
                    setActivationData((prev) => ({
                      ...prev,
                      hardware_id: e.target.value,
                    }))
                  }
                  placeholder="HW-ABC123DEF456"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafafa",
                      color: "#2c3e50",
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={generateTestHardwareId}
                  sx={{
                    minWidth: "120px",
                    borderColor: "#2e7d32",
                    color: "#2e7d32",
                    "&:hover": {
                      borderColor: "#1b5e20",
                      backgroundColor: "rgba(46, 125, 50, 0.05)",
                    },
                  }}
                >
                  테스트 ID 생성
                </Button>
              </Box>

              <Button
                variant="contained"
                onClick={handleActivate}
                disabled={loading}
                size="large"
                sx={{
                  width: "100%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  py: 1.5,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  },
                }}
              >
                {loading ? "활성화 중..." : "🔑 라이선스 활성화"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: "#ffffff",
              border: "2px solid #fff3e0",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#f57c00",
                  mb: 2,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                ℹ️ 활성화 안내
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#2c3e50", mb: 2, fontWeight: "500" }}
              >
                <strong>1단계:</strong> 구매 완료 후 받은 임시 라이선스를
                입력하세요.
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#2c3e50", mb: 2, fontWeight: "500" }}
              >
                <strong>2단계:</strong> 프로그램을 설치할 컴퓨터의 하드웨어 ID를
                입력하세요.
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#2c3e50", mb: 2, fontWeight: "500" }}
              >
                <strong>활성화 완료:</strong> 최종 인증키가 생성되어
                프로그램에서 사용할 수 있습니다.
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#666666", fontWeight: "400" }}
              >
                * 하드웨어 ID는 한 번 등록하면 변경할 수 없습니다.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 결과 표시 */}
        {result && (
          <Grid item xs={12}>
            <Alert
              severity={result.includes("✅") ? "success" : "error"}
              sx={{
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              {result}
            </Alert>
          </Grid>
        )}

        {/* 활성화 결과 */}
        {activationResult && (
          <Grid item xs={12}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)",
                border: "2px solid #4caf50",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(76, 175, 80, 0.2)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#2e7d32",
                    mb: 2,
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  ✅ 활성화 완료
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", mb: 1, fontWeight: "600" }}
                    >
                      <strong>버전:</strong> {activationResult.version}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", mb: 1, fontWeight: "600" }}
                    >
                      <strong>활성화 날짜:</strong>{" "}
                      {new Date(
                        activationResult.activation_date
                      ).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", mb: 1, fontWeight: "600" }}
                    >
                      <strong>만료일:</strong>{" "}
                      {new Date(
                        activationResult.expire_date
                      ).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  {activationResult.final_license && (
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#2c3e50", mb: 1, fontWeight: "600" }}
                      >
                        최종 인증키 (프로그램에서 사용):
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={activationResult.final_license}
                        InputProps={{ readOnly: true }}
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#ffffff",
                            color: "#2c3e50",
                            border: "2px solid #4caf50",
                          },
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default LicenseActivate;
