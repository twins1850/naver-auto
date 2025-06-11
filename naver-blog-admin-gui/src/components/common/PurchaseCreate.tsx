import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
} from "@mui/material";
import {
  createPurchase,
  PRICING_CONFIG,
  calculatePrice,
  calculateMonthlyPrice,
  calculateDiscountInfo,
  generateVersion,
  getFeaturesByVersion,
} from "../../api/purchase";

const PurchaseCreate: React.FC = () => {
  // 랜딩페이지와 동일한 주문번호 생성 함수
  const generateOrderId = (): string => {
    const cleanProductName = `blog-pro-${orderData.account_count}-${orderData.post_count}-${orderData.months}months`;
    const timestamp = Date.now();
    return `${cleanProductName}-${timestamp}`;
  };

  const [orderData, setOrderData] = useState({
    order_id: "", // 동적으로 계산됨
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    account_count: 1,
    post_count: 1,
    months: 6,
  });

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdPurchase, setCreatedPurchase] = useState<any>(null);

  // 동적 계산
  const currentVersion = generateVersion(
    orderData.account_count,
    orderData.post_count
  );
  const currentPrice = calculatePrice(
    orderData.account_count,
    orderData.post_count,
    orderData.months
  );
  const discountInfo = calculateDiscountInfo(
    orderData.account_count,
    orderData.post_count,
    orderData.months
  );
  const currentFeatures = getFeaturesByVersion(
    orderData.account_count,
    orderData.post_count
  );
  const currentOrderId = generateOrderId(); // 동적으로 생성된 주문번호

  const calculateExpireDate = () => {
    const expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + orderData.months);
    return expireDate.toISOString();
  };

  const handleCreate = async () => {
    if (
      !orderData.order_id ||
      !orderData.customer_name ||
      !orderData.customer_email
    ) {
      setResult("필수 정보를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const purchaseData = {
        ...orderData,
        order_id: currentOrderId,
        version: currentVersion,
        amount: currentPrice,
        expire_date: calculateExpireDate(),
      };

      const res = await createPurchase(purchaseData);
      setCreatedPurchase(res);
      setResult("✅ 구매/라이선스가 성공적으로 생성되었습니다!");

      // 폼 초기화
      setOrderData({
        order_id: generateOrderId(),
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        account_count: 1,
        post_count: 1,
        months: 6,
      });
    } catch (e: any) {
      setResult(
        "❌ 생성 실패: " + (e?.response?.data?.message || e?.message || "오류")
      );
    }
    setLoading(false);
  };

  // 아이디 수 옵션 생성
  const accountOptions = Array.from(
    { length: PRICING_CONFIG.maxAccounts },
    (_, i) => i + 1
  );

  // 글 수 옵션 생성
  const postOptions = Array.from(
    { length: PRICING_CONFIG.maxPosts },
    (_, i) => i + 1
  );

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
        🛒 구매/라이선스 생성 (동적 가격 정책)
      </Typography>

      <Grid container spacing={3}>
        {/* 고객 정보 */}
        <Grid item xs={12} md={6}>
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
                👤 고객 정보
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="주문번호 (자동생성)"
                  value={currentOrderId}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                  placeholder="blog-pro-1-1-6months-1234567890"
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    // 강제로 리렌더링 트리거
                    setOrderData((prev) => ({ ...prev }));
                  }}
                  sx={{ minWidth: "100px" }}
                >
                  새로 생성
                </Button>
              </Box>

              <TextField
                fullWidth
                label="고객명"
                value={orderData.customer_name}
                onChange={(e) =>
                  setOrderData((prev) => ({
                    ...prev,
                    customer_name: e.target.value,
                  }))
                }
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fafafa",
                  },
                }}
              />

              <TextField
                fullWidth
                label="이메일"
                type="email"
                value={orderData.customer_email}
                onChange={(e) =>
                  setOrderData((prev) => ({
                    ...prev,
                    customer_email: e.target.value,
                  }))
                }
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fafafa",
                  },
                }}
              />

              <TextField
                fullWidth
                label="전화번호 (선택)"
                value={orderData.customer_phone}
                onChange={(e) =>
                  setOrderData((prev) => ({
                    ...prev,
                    customer_phone: e.target.value,
                  }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fafafa",
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 버전 및 옵션 */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: "#ffffff",
              border: "2px solid #f3e5f5",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#7b1fa2",
                  mb: 2,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                ⚙️ 버전 및 옵션
              </Typography>

              {/* 현재 버전 표시 */}
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  background:
                    "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#ffffff",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  버전 {currentVersion}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    textAlign: "center",
                  }}
                >
                  아이디 {orderData.account_count}개 × 글 {orderData.post_count}
                  개
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "#424242" }}>아이디 수</InputLabel>
                    <Select
                      value={orderData.account_count}
                      label="아이디 수"
                      onChange={(e) =>
                        setOrderData((prev) => ({
                          ...prev,
                          account_count: Number(e.target.value),
                        }))
                      }
                      sx={{
                        backgroundColor: "#fafafa",
                        "& .MuiSelect-select": {
                          color: "#2c3e50",
                        },
                      }}
                    >
                      {accountOptions.map((count) => (
                        <MenuItem key={count} value={count}>
                          {count}개
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "#424242" }}>글 수</InputLabel>
                    <Select
                      value={orderData.post_count}
                      label="글 수"
                      onChange={(e) =>
                        setOrderData((prev) => ({
                          ...prev,
                          post_count: Number(e.target.value),
                        }))
                      }
                      sx={{
                        backgroundColor: "#fafafa",
                        "& .MuiSelect-select": {
                          color: "#2c3e50",
                        },
                      }}
                    >
                      {postOptions.map((count) => (
                        <MenuItem key={count} value={count}>
                          {count}개
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "#424242" }}>사용 기간</InputLabel>
                    <Select
                      value={orderData.months}
                      label="사용 기간"
                      onChange={(e) =>
                        setOrderData((prev) => ({
                          ...prev,
                          months: Number(e.target.value),
                        }))
                      }
                      sx={{
                        backgroundColor: "#fafafa",
                        "& .MuiSelect-select": {
                          color: "#2c3e50",
                        },
                      }}
                    >
                      {PRICING_CONFIG.availableMonths.map((month) => (
                        <MenuItem key={month} value={month}>
                          {month}개월
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* 기능 표시 */}
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#555555", mb: 1, fontWeight: "600" }}
                >
                  포함 기능:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {currentFeatures.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        fontWeight: "500",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 결제 정보 */}
        <Grid item xs={12}>
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
                💳 결제 정보
              </Typography>

              {/* 가격 계산 상세 */}
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  background:
                    "linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(33, 150, 243, 0.3)",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: "500" }}
                >
                  기본료: ₩{PRICING_CONFIG.basePrice.toLocaleString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: "500" }}
                >
                  추가요금: ₩
                  {(
                    orderData.account_count *
                    orderData.post_count *
                    PRICING_CONFIG.unitPrice
                  ).toLocaleString()}
                  ({orderData.account_count} × {orderData.post_count} × ₩
                  {PRICING_CONFIG.unitPrice.toLocaleString()})
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: "500" }}
                >
                  월 이용료: ₩{discountInfo.monthlyPrice.toLocaleString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: "500" }}
                >
                  {orderData.months}개월 총액: ₩
                  {discountInfo.totalBeforeDiscount.toLocaleString()}
                </Typography>
                {discountInfo.discountRate > 0 && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: "500",
                    }}
                  >
                    할인 ({discountInfo.discountRate}%): -₩
                    {discountInfo.discountAmount.toLocaleString()}
                  </Typography>
                )}
                <Typography
                  variant="h5"
                  sx={{ color: "#ffffff", mt: 1, fontWeight: "bold" }}
                >
                  최종 결제금액: ₩{discountInfo.finalPrice.toLocaleString()}
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#666666", fontWeight: "500" }}
                >
                  만료일: {new Date(calculateExpireDate()).toLocaleDateString()}
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleCreate}
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
                {loading ? "생성 중..." : "🚀 구매/라이선스 생성"}
              </Button>
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

        {/* 생성된 라이선스 정보 */}
        {createdPurchase && (
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
                  ✅ 생성 완료
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", fontWeight: "500", mb: 1 }}
                    >
                      주문번호: {createdPurchase.order_id}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", fontWeight: "500", mb: 1 }}
                    >
                      고객: {createdPurchase.customer_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", fontWeight: "500", mb: 1 }}
                    >
                      버전: {createdPurchase.version}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c3e50", fontWeight: "500", mb: 1 }}
                    >
                      결제금액: ₩{createdPurchase.amount?.toLocaleString()}
                    </Typography>
                  </Grid>

                  {createdPurchase.temporary_license && (
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#2c3e50", mb: 1, fontWeight: "600" }}
                      >
                        임시 라이선스:
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={createdPurchase.temporary_license}
                        InputProps={{ readOnly: true }}
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#ffffff",
                            color: "#2c3e50",
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

export default PurchaseCreate;
