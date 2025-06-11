import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";

interface License {
  id: number;
  user_id: number;
  key: string;
  plan: string;
  status: string;
  issued_at: string;
  expire_at: string | null;
}

const LicenseList: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLicenses = () => {
    setLoading(true);
    axios
      .get("/licenses")
      .then((res) => setLicenses(res.data))
      .catch(() => setError("인증키 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleRevoke = async (id: number) => {
    if (!window.confirm("정말로 이 인증키를 회수(비활성화)하시겠습니까?"))
      return;
    try {
      await axios.patch(`/licenses/${id}`, { status: "inactive" });
      fetchLicenses();
    } catch {
      alert("회수에 실패했습니다.");
    }
  };

  if (loading) return <Typography>로딩 중...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>라이선스 키</TableCell>
            <TableCell>유저ID</TableCell>
            <TableCell>플랜</TableCell>
            <TableCell>상태</TableCell>
            <TableCell>발급일</TableCell>
            <TableCell>만료일</TableCell>
            <TableCell>관리</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {licenses.map((lic) => (
            <TableRow key={lic.id}>
              <TableCell>{lic.id}</TableCell>
              <TableCell>{lic.key}</TableCell>
              <TableCell>{lic.user_id}</TableCell>
              <TableCell>{lic.plan}</TableCell>
              <TableCell>{lic.status}</TableCell>
              <TableCell>{lic.issued_at?.slice(0, 10)}</TableCell>
              <TableCell>{lic.expire_at?.slice(0, 10) || "-"}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleRevoke(lic.id)}
                  disabled={lic.status === "inactive"}
                >
                  회수
                </Button>{" "}
                <Button size="small" variant="contained">
                  연장
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LicenseList;
