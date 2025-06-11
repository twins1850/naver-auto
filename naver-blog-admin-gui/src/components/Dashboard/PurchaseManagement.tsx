import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import StatusBadge from "../common/StatusBadge";
import { client } from "../../api/client";

const StyledCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  marginBottom: theme.spacing(3),
}));

interface Purchase {
  id: number;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  version: string;
  account_count: number;
  post_count: number;
  months: number;
  amount: number;
  payment_status: string;
  temporary_license?: string;
  final_license?: string;
  hardware_id?: string;
  activation_date?: string;
  status: string;
  created_at: string;
  expire_date: string;
}

const PurchaseManagement: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 필터링된 데이터 계산
  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 페이징된 데이터 계산
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPurchases = filteredPurchases.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 페이지 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      console.log("🔍 디버깅 - API 호출 시작");

      const response = await client.get("/purchases/");

      console.log("🔍 디버깅 - 응답 상태:", response.status);
      console.log("🔍 디버깅 - 받은 데이터:", response.data);
      console.log("🔍 디버깅 - 데이터 개수:", response.data.length);

      setPurchases(response.data);
    } catch (error: any) {
      console.error("구매 목록 조회 중 오류:", error);
      console.error("오류 상세:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "activated":
        return "success";
      case "expired":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "활성화 대기";
      case "activated":
        return "활성화됨";
      case "expired":
        return "만료됨";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR");
  };

  const formatAmount = (amount: number) => {
    return `₩${amount.toLocaleString()}`;
  };

  const handleViewDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setDetailOpen(true);
  };

  return (
    <Box>
      {/* 구매 관리 탭 명확한 식별자 */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          background: "rgba(255,0,0,0.1)",
          border: "2px solid red",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "red", fontWeight: "bold", textAlign: "center" }}
        >
          🔴 이것은 구매 관리 탭입니다! 🔴
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "red", textAlign: "center", mt: 1 }}
        >
          김형원님의 구매 내역을 테이블로 표시합니다
        </Typography>
      </Box>

      <StyledCard>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            sx={{
              background: "rgba(0,255,0,0.2)",
              border: "2px solid green",
              p: 2,
              borderRadius: 1,
              zIndex: 9999,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                background: "linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              🛒 구매/라이선스 통합 관리
            </Typography>
            <Tooltip title="새로고침">
              <IconButton
                onClick={fetchPurchases}
                disabled={loading}
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            sx={{
              mb: 2,
              p: 2,
              background: "rgba(0,0,255,0.2)",
              border: "3px solid blue",
              borderRadius: 1,
              zIndex: 9999,
              position: "relative",
            }}
          >
            <Typography variant="h6" sx={{ color: "blue", fontWeight: "bold" }}>
              🔍 디버깅: purchases 배열 길이 = {purchases.length}, loading ={" "}
              {loading.toString()}
            </Typography>
            <Typography variant="body2" sx={{ color: "blue", mt: 1 }}>
              데이터가 {purchases.length}개 로드되었습니다. 필터링 후{" "}
              {filteredPurchases.length}개, 현재 페이지{" "}
              {paginatedPurchases.length}개 표시
            </Typography>
          </Box>

          {/* 검색 및 필터 영역 */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 1,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="고객명, 주문번호, 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: "white", mr: 1 }} />
                    ),
                    sx: { color: "white" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.5)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "white" }}>상태 필터</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.3)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.5)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                    }}
                  >
                    <MenuItem value="all">전체</MenuItem>
                    <MenuItem value="pending">활성화 대기</MenuItem>
                    <MenuItem value="activated">활성화됨</MenuItem>
                    <MenuItem value="expired">만료됨</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "white" }}>페이지 크기</InputLabel>
                  <Select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.3)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.5)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                    }}
                  >
                    <MenuItem value={5}>5개</MenuItem>
                    <MenuItem value={10}>10개</MenuItem>
                    <MenuItem value={20}>20개</MenuItem>
                    <MenuItem value={50}>50개</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ color: "white" }}>
                  총 {filteredPurchases.length}개 주문 (전체 {purchases.length}
                  개)
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              background: "rgba(255,255,0,0.3)",
              border: "3px solid orange",
              p: 2,
              borderRadius: 1,
              zIndex: 10000,
              position: "relative",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "orange", fontWeight: "bold", mb: 2 }}
            >
              📊 구매 데이터 테이블 (강제 표시)
            </Typography>

            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "2px solid black",
                zIndex: 10001,
                position: "relative",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "rgba(59, 130, 246, 0.8)" }}>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      주문번호
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      고객정보
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      상품정보
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      결제금액
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      상태
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      주문일시
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      관리
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* 실제 데이터 렌더링 */}
                  {(() => {
                    console.log(
                      "🔥 paginatedPurchases 전체 배열:",
                      paginatedPurchases
                    );
                    console.log(
                      "🔥 paginatedPurchases.length:",
                      paginatedPurchases.length
                    );
                    console.log(
                      "🔥 Array.isArray(paginatedPurchases):",
                      Array.isArray(paginatedPurchases)
                    );

                    if (paginatedPurchases.length > 0) {
                      console.log("🔥 첫번째 purchase:", paginatedPurchases[0]);
                      console.log(
                        "🔥 첫번째 purchase의 키들:",
                        Object.keys(paginatedPurchases[0])
                      );
                    }

                    return paginatedPurchases.length > 0 ? (
                      paginatedPurchases.map((purchase, index) => {
                        console.log(
                          `🔍 렌더링할 purchase[${index}]:`,
                          purchase
                        );
                        console.log(`🔍 purchase.id: ${purchase.id}`);
                        console.log(
                          `🔍 purchase.customer_name: ${purchase.customer_name}`
                        );
                        console.log(
                          `🔍 purchase.order_id: ${purchase.order_id}`
                        );

                        return (
                          <TableRow
                            key={`purchase-${purchase.id}-${index}`}
                            hover
                            sx={{
                              background: "rgba(255,255,255,0.9) !important",
                              border: "3px solid blue !important",
                              zIndex: 999999,
                              position: "relative",
                              "& > *": {
                                color: "black !important",
                                fontWeight: "bold !important",
                                fontSize: "16px !important",
                                background: "rgba(255,255,255,0.95) !important",
                                border: "1px solid black !important",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                color: "black !important",
                                fontWeight: "bold !important",
                                background: "rgba(255,255,255,0.95) !important",
                                border: "1px solid black !important",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: "monospace",
                                  color: "black !important",
                                  fontWeight: "bold !important",
                                }}
                              >
                                {purchase.order_id || "주문번호 없음"}
                              </Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "black !important",
                                fontWeight: "bold !important",
                                background: "rgba(255,255,255,0.95) !important",
                                border: "1px solid black !important",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: "bold !important",
                                    color: "black !important",
                                  }}
                                >
                                  {purchase.customer_name || "이름 없음"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "gray !important",
                                    fontWeight: "bold !important",
                                  }}
                                >
                                  {purchase.customer_email || "이메일 없음"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "black !important",
                                fontWeight: "bold !important",
                                background: "rgba(255,255,255,0.95) !important",
                                border: "1px solid black !important",
                              }}
                            >
                              <Box>
                                <Chip
                                  label={`v${purchase.version || "없음"}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: "blue !important",
                                    color: "white !important",
                                    mb: 0.5,
                                    fontWeight: "bold !important",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  display="block"
                                  sx={{
                                    color: "black !important",
                                    fontWeight: "bold !important",
                                  }}
                                >
                                  아이디 {purchase.account_count || 0}개 × 글{" "}
                                  {purchase.post_count || 0}개
                                </Typography>
                                <Typography
                                  variant="caption"
                                  display="block"
                                  sx={{
                                    color: "black !important",
                                    fontWeight: "bold !important",
                                  }}
                                >
                                  {purchase.months || 0}개월
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "black !important",
                                fontWeight: "bold !important",
                                background: "rgba(255,255,255,0.95) !important",
                                border: "1px solid black !important",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: "bold !important",
                                  color: "black !important",
                                }}
                              >
                                {formatAmount(purchase.amount || 0)}
                              </Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                background: "rgba(255,255,255,0.95) !important",
                                border: "1px solid black !important",
                              }}
                            >
                              <StatusBadge
                                status={purchase.status as any}
                                label={getStatusLabel(
                                  purchase.status || "unknown"
                                )}
                                size="small"
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "black !important",
                                fontWeight: "bold !important",
                                background: "rgba(255,255,255,0.95) !important",
                                border: "1px solid black !important",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "black !important",
                                  fontWeight: "bold !important",
                                }}
                              >
                                {purchase.created_at
                                  ? formatDate(purchase.created_at)
                                  : "날짜 없음"}
                              </Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                background: "rgba(255,255,255,0.95) !important",
                                border: "1px solid black !important",
                              }}
                            >
                              <Tooltip title="상세보기">
                                <IconButton
                                  onClick={() => handleViewDetails(purchase)}
                                  sx={{
                                    color: "black !important",
                                    background: "white !important",
                                    border: "1px solid black !important",
                                  }}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          sx={{
                            textAlign: "center",
                            color: "red",
                            fontWeight: "bold",
                            fontSize: "18px",
                          }}
                        >
                          ❌ 현재 페이지에 표시할 데이터가 없습니다! (전체:{" "}
                          {filteredPurchases.length}개)
                        </TableCell>
                      </TableRow>
                    );
                  })()}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 페이징 컨트롤 */}
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ color: "white" }}>
                  {startIndex + 1}-
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredPurchases.length
                  )}{" "}
                  / {filteredPurchases.length}개 표시
                </Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "white",
                      borderColor: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(59, 130, 246, 0.8)",
                        color: "white",
                      },
                    },
                  }}
                />
              </Stack>
            </Box>

            {paginatedPurchases.length === 0 &&
              !loading &&
              filteredPurchases.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    {searchTerm || statusFilter !== "all"
                      ? "검색 조건에 맞는 구매 내역이 없습니다."
                      : "구매 내역이 없습니다."}
                  </Typography>
                </Box>
              )}
          </Box>
        </CardContent>
      </StyledCard>

      {/* 상세보기 다이얼로그 */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#ffffff",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          구매 상세 정보
        </DialogTitle>
        {selectedPurchase && (
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: "#ffffff", mb: 2 }}>
                  고객 정보
                </Typography>
                <Box sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  <Typography>
                    이름: {selectedPurchase.customer_name}
                  </Typography>
                  <Typography>
                    이메일: {selectedPurchase.customer_email}
                  </Typography>
                  <Typography>
                    전화번호: {selectedPurchase.customer_phone || "없음"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: "#ffffff", mb: 2 }}>
                  구매 정보
                </Typography>
                <Box sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  <Typography>주문번호: {selectedPurchase.order_id}</Typography>
                  <Typography>버전: {selectedPurchase.version}</Typography>
                  <Typography>
                    사용량: 아이디 {selectedPurchase.account_count}개 × 글{" "}
                    {selectedPurchase.post_count}개
                  </Typography>
                  <Typography>기간: {selectedPurchase.months}개월</Typography>
                  <Typography>
                    결제금액: {formatAmount(selectedPurchase.amount)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: "#ffffff", mb: 2 }}>
                  라이선스 정보
                </Typography>
                <Box sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  <Typography>
                    상태: {getStatusLabel(selectedPurchase.status)}
                  </Typography>
                  <Typography>
                    하드웨어 ID: {selectedPurchase.hardware_id || "없음"}
                  </Typography>
                  <Typography>
                    활성화 날짜:{" "}
                    {selectedPurchase.activation_date
                      ? formatDate(selectedPurchase.activation_date)
                      : "없음"}
                  </Typography>
                  <Typography>
                    만료일: {formatDate(selectedPurchase.expire_date)}
                  </Typography>
                </Box>
              </Grid>

              {selectedPurchase.temporary_license && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: "#ffffff", mb: 2 }}>
                    임시 라이선스
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={selectedPurchase.temporary_license}
                    InputProps={{ readOnly: true }}
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "0.8rem",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                      },
                    }}
                  />
                </Grid>
              )}

              {selectedPurchase.final_license && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: "#ffffff", mb: 2 }}>
                    최종 인증키
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={selectedPurchase.final_license}
                    InputProps={{ readOnly: true }}
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "0.8rem",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                      },
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
        )}
        <DialogActions sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <Button
            onClick={() => setDetailOpen(false)}
            sx={{ color: "#ffffff" }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseManagement;
