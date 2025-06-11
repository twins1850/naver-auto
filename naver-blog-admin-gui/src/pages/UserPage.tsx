import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Card,
  CardContent,
  Chip,
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

// 구매 고객 데이터 인터페이스 (Google Sheets 기반)
interface Customer {
  이름: string;
  이메일: string;
  연락처: string;
  결제일시: string;
  결제금액: string;
  상품유형: string;
  아이디수: number;
  글수: number;
  개월수: number;
  라이센스키: string;
  발급일시: string;
  만료일시: string;
  상태: string;
  하드웨어ID: string;
  결제상태: string;
  주문번호: string;
  결제ID: string;
}

interface CustomerQuery {
  이름: string;
  이메일: string;
  연락처: string;
  주문번호: string;
  결제상태: string;
  상태: string;
  상품유형: string;
}

const defaultQuery: CustomerQuery = {
  이름: "",
  이메일: "",
  연락처: "",
  주문번호: "",
  결제상태: "",
  상태: "",
  상품유형: "",
};

const UserPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState<CustomerQuery>(defaultQuery);
  const [totalStats, setTotalStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0,
    totalRevenue: 0,
  });

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";

    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, "");

    // 11자리 숫자인 경우 010-xxxx-xxxx 형식으로 변환
    if (numbers.length === 11 && numbers.startsWith("010")) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }

    // 10자리 숫자인 경우 0xx-xxx-xxxx 형식으로 변환
    if (numbers.length === 10) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    }

    return numbers;
  };

  // 전화번호 입력 핸들러
  const handlePhoneChange = (value: string) => {
    // 숫자만 허용
    const numbersOnly = value.replace(/[^0-9]/g, "");

    // 최대 11자리까지만 허용
    if (numbersOnly.length <= 11) {
      const formatted = formatPhoneNumber(numbersOnly);
      handleInputChange("연락처", formatted);
    }
  };

  // Google Sheets 통합 데이터 조회
  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🔍 구매 고객 데이터 조회 시작");

      // 랜딩페이지의 통합 데이터 API 호출
      const response = await fetch(
        "http://localhost:3000/api/admin/unified-data"
      );

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "데이터 조회 실패");
      }

      console.log("✅ 구매 고객 데이터:", result.data.length, "개");
      setCustomers(result.data);
      setFilteredCustomers(result.data);

      // 통계 계산
      const total = result.data.length;
      const active = result.data.filter(
        (c: Customer) => c.상태 === "active"
      ).length;
      const pending = result.data.filter(
        (c: Customer) => c.상태 === "pending"
      ).length;
      const expired = result.data.filter(
        (c: Customer) => c.상태 === "expired"
      ).length;
      const totalRevenue = result.data.reduce((sum: number, c: Customer) => {
        const amount = parseInt(c.결제금액?.replace(/[^0-9]/g, "") || "0");
        return sum + amount;
      }, 0);

      setTotalStats({ total, active, pending, expired, totalRevenue });
    } catch (e: any) {
      console.error("❌ 구매 고객 데이터 조회 실패:", e);
      setError("구매 고객 데이터를 불러오지 못했습니다: " + e.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 실시간 검색 필터링
  useEffect(() => {
    let filtered = customers;

    // 각 검색 조건 적용
    if (query.이름) {
      filtered = filtered.filter((c) =>
        c.이름?.toLowerCase().includes(query.이름.toLowerCase())
      );
    }
    if (query.이메일) {
      filtered = filtered.filter((c) =>
        c.이메일?.toLowerCase().includes(query.이메일.toLowerCase())
      );
    }
    if (query.연락처) {
      filtered = filtered.filter((c) => c.연락처?.includes(query.연락처));
    }
    if (query.주문번호) {
      filtered = filtered.filter((c) =>
        c.주문번호?.toLowerCase().includes(query.주문번호.toLowerCase())
      );
    }
    if (query.결제상태) {
      filtered = filtered.filter((c) => c.결제상태 === query.결제상태);
    }
    if (query.상태) {
      filtered = filtered.filter((c) => c.상태 === query.상태);
    }
    if (query.상품유형) {
      filtered = filtered.filter((c) => c.상품유형?.includes(query.상품유형));
    }

    setFilteredCustomers(filtered);
  }, [query, customers]);

  const handleInputChange = (field: keyof CustomerQuery, value: string) => {
    setQuery((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setQuery(defaultQuery);
  };

  const formatAmount = (amount: string) => {
    const num = parseInt(amount?.replace(/[^0-9]/g, "") || "0");
    return `₩${num.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("ko-KR");
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "expired":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "활성화";
      case "pending":
        return "대기중";
      case "expired":
        return "만료됨";
      default:
        return status;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 헤더 */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          👥 구매 고객 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchCustomers}
          disabled={isLoading}
        >
          새로고침
        </Button>
      </Box>

      {/* 통계 카드 */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
        <Card
          sx={{
            bgcolor: "#e3f2fd",
            textAlign: "center",
            minWidth: 120,
            flex: 1,
          }}
        >
          <CardContent>
            <Typography variant="h6" color="primary">
              {totalStats.total}
            </Typography>
            <Typography variant="body2">총 고객</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            bgcolor: "#e8f5e8",
            textAlign: "center",
            minWidth: 120,
            flex: 1,
          }}
        >
          <CardContent>
            <Typography variant="h6" color="success.main">
              {totalStats.active}
            </Typography>
            <Typography variant="body2">활성 고객</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            bgcolor: "#fff3e0",
            textAlign: "center",
            minWidth: 120,
            flex: 1,
          }}
        >
          <CardContent>
            <Typography variant="h6" color="warning.main">
              {totalStats.pending}
            </Typography>
            <Typography variant="body2">대기 고객</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            bgcolor: "#ffebee",
            textAlign: "center",
            minWidth: 120,
            flex: 1,
          }}
        >
          <CardContent>
            <Typography variant="h6" color="error.main">
              {totalStats.expired}
            </Typography>
            <Typography variant="body2">만료 고객</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            bgcolor: "#f3e5f5",
            textAlign: "center",
            minWidth: 120,
            flex: 1,
          }}
        >
          <CardContent>
            <Typography variant="h6" color="secondary.main">
              ₩{totalStats.totalRevenue.toLocaleString()}
            </Typography>
            <Typography variant="body2">총 매출</Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* 검색 필터 */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔍 검색 필터
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(6, 1fr) 0.8fr 0.8fr",
            },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="고객명"
            value={query.이름}
            onChange={(e) => handleInputChange("이름", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="이메일"
            value={query.이메일}
            onChange={(e) => handleInputChange("이메일", e.target.value)}
          />
          <TextField
            fullWidth
            label="연락처"
            placeholder="010-0000-0000"
            value={query.연락처}
            onChange={(e) => handlePhoneChange(e.target.value)}
            inputProps={{
              maxLength: 13, // 010-0000-0000 형식 최대 길이
            }}
          />
          <TextField
            fullWidth
            label="주문번호"
            value={query.주문번호}
            onChange={(e) => handleInputChange("주문번호", e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>결제상태</InputLabel>
            <Select
              value={query.결제상태}
              label="결제상태"
              onChange={(e) => handleInputChange("결제상태", e.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="completed">완료</MenuItem>
              <MenuItem value="pending">대기</MenuItem>
              <MenuItem value="failed">실패</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>라이센스 상태</InputLabel>
            <Select
              value={query.상태}
              label="라이센스 상태"
              onChange={(e) => handleInputChange("상태", e.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="active">활성화</MenuItem>
              <MenuItem value="pending">대기중</MenuItem>
              <MenuItem value="expired">만료됨</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="상품유형"
            placeholder="예: blog-pro"
            value={query.상품유형}
            onChange={(e) => handleInputChange("상품유형", e.target.value)}
          />
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClearFilters}
            sx={{ height: "56px" }}
          >
            필터 초기화
          </Button>
        </Box>
      </Card>

      {/* 결과 표시 */}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">
              📊 검색 결과: {filteredCustomers.length}명 / 총 {customers.length}
              명
            </Typography>
          </Box>

          {isLoading ? (
            <LoadingSpinner message="구매 고객 정보를 불러오는 중..." />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : filteredCustomers.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              검색 결과가 없습니다.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>고객명</strong>
                    </TableCell>
                    <TableCell>
                      <strong>이메일</strong>
                    </TableCell>
                    <TableCell>
                      <strong>연락처</strong>
                    </TableCell>
                    <TableCell>
                      <strong>상품유형</strong>
                    </TableCell>
                    <TableCell>
                      <strong>결제금액</strong>
                    </TableCell>
                    <TableCell>
                      <strong>결제일</strong>
                    </TableCell>
                    <TableCell>
                      <strong>만료일</strong>
                    </TableCell>
                    <TableCell>
                      <strong>상태</strong>
                    </TableCell>
                    <TableCell>
                      <strong>주문번호</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.map((customer, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{customer.이름}</TableCell>
                      <TableCell>{customer.이메일}</TableCell>
                      <TableCell>
                        {formatPhoneNumber(customer.연락처)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.상품유형}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatAmount(customer.결제금액)}</TableCell>
                      <TableCell>{formatDate(customer.결제일시)}</TableCell>
                      <TableCell>{formatDate(customer.만료일시)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(customer.상태)}
                          size="small"
                          color={getStatusColor(customer.상태)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {customer.주문번호}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserPage;
