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
  Chip,
} from "@mui/material";
import { validateLicense, getFeaturesByVersion } from "../../api/purchase";

const LicenseValidate: React.FC = () => {
  const [validationData, setValidationData] = useState({
    license_key: "",
    hardware_id: "",
  });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleValidate = async () => {
    if (!validationData.license_key || !validationData.hardware_id) {
      setResult("라이선스 키와 하드웨어 ID를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await validateLicense(validationData);
      setValidationResult(res);
      setResult(
        res.valid
          ? "✅ 유효한 라이선스입니다!"
          : `❌ 무효한 라이선스: ${res.reason}`
      );
    } catch (e: any) {
      setResult(
        "❌ 검증 실패: " + (e?.response?.data?.message || e?.message || "오류")
      );
    }
    setLoading(false);
  };

  const generateTestHardwareId = () => {
    const randomId =
      "HW-" + Math.random().toString(36).substring(2, 15).toUpperCase();
    setValidationData((prev) => ({ ...prev, hardware_id: randomId }));
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
        🔍 라이선스 검증 (동적 버전 기반)
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: "#ffffff",
              border: "2px solid #e3f2fd",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#1976d2",
                  mb: 2,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                📄 검증 정보 입력
              </Typography>

              <TextField
                fullWidth
                label="라이선스 키 (최종 인증키)"
                value={validationData.license_key}
                onChange={(e) =>
                  setValidationData((prev) => ({
                    ...prev,
                    license_key: e.target.value,
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
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              />

              <Box display="flex" gap={1} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="하드웨어 ID"
                  value={validationData.hardware_id}
                  onChange={(e) =>
                    setValidationData((prev) => ({
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
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    "&:hover": {
                      borderColor: "#1565c0",
                      backgroundColor: "rgba(25, 118, 210, 0.05)",
                    },
                  }}
                >
                  테스트 ID 생성
                </Button>
              </Box>

              <Button
                variant="contained"
                onClick={handleValidate}
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
                {loading ? "검증 중..." : "🔍 라이선스 검증"}
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
                ℹ️ 검증 안내
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#2c3e50", mb: 2, fontWeight: "500" }}
              >
                <strong>1단계:</strong> 활성화 완료 후 받은 최종 인증키를
                입력하세요.
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#2c3e50", mb: 2, fontWeight: "500" }}
              >
                <strong>2단계:</strong> 프로그램이 설치된 컴퓨터의 하드웨어 ID를
                입력하세요.
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#2c3e50", mb: 2, fontWeight: "500" }}
              >
                <strong>검증 결과:</strong> 버전별 사용 가능한 기능과 제한이
                표시됩니다.
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#666666", fontWeight: "400" }}
              >
                * 하드웨어 ID는 활성화 시 사용한 것과 동일해야 합니다.
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

        {/* 검증 결과 */}
        {validationResult && validationResult.valid && (
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
                  ✅ 라이선스 유효함
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", mb: 1, fontWeight: "600" }}
                    >
                      <strong>버전:</strong> {validationResult.version}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", mb: 1, fontWeight: "600" }}
                    >
                      <strong>사용 가능 아이디:</strong>{" "}
                      {validationResult.account_count}개
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", mb: 1, fontWeight: "600" }}
                    >
                      <strong>사용 가능 글 수:</strong>{" "}
                      {validationResult.post_count}개
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", mb: 1, fontWeight: "600" }}
                    >
                      <strong>만료일:</strong>{" "}
                      {new Date(
                        validationResult.expire_date
                      ).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", mb: 1, fontWeight: "600" }}
                    >
                      <strong>사용 가능 기능:</strong>
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {getFeaturesByVersion(
                        validationResult.account_count,
                        validationResult.post_count
                      ).map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          sx={{
                            backgroundColor: "#e8f5e8",
                            color: "#2e7d32",
                            fontWeight: "500",
                            border: "1px solid #4caf50",
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default LicenseValidate;
