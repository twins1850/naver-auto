import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

// 공지사항 타입 정의
interface Notice {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

const NoticePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Notice[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // TODO: 실제 API 연동 필요
    setTimeout(() => {
      setData([
        {
          id: 1,
          title: "테스트 공지",
          created_at: "2024-05-21",
          updated_at: "2024-05-21",
          is_active: true,
        },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  if (isLoading)
    return <LoadingSpinner message="공지사항 정보를 불러오는 중..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h2">
          공지사항 관리
        </Typography>
        <Button variant="contained" color="primary">
          새 공지사항 작성
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>작성일</TableCell>
              <TableCell>수정일</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>{notice.id}</TableCell>
                <TableCell>{notice.title}</TableCell>
                <TableCell>{notice.created_at}</TableCell>
                <TableCell>{notice.updated_at}</TableCell>
                <TableCell>{notice.is_active ? "활성" : "비활성"}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NoticePage;
