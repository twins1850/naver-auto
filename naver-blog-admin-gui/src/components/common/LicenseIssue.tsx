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
} from "@mui/material";
import { issueLicense } from "../../api/license";

const LicenseIssue: React.FC = () => {
  const [userId, setUserId] = useState(""); // userId는 실제 데이터로 연동 예정
  const [plan, setPlan] = useState("basic");
  const [expireAt, setExpireAt] = useState("");
  const [version, setVersion] = useState("");
  const [hardwareId, setHardwareId] = useState("");
  const [issuedToken, setIssuedToken] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIssue = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await issueLicense({
        user_id: Number(userId),
        plan,
        expire_at: expireAt || undefined,
        version,
        hardware_id: hardwareId,
      });
      setIssuedToken(res.key || res.license_key || "");
      setResult("인증키 발급 성공!");
    } catch (e: any) {
      setResult("발급 실패: " + (e?.message || "오류"));
    }
    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6">인증키 발급</Typography>
      <TextField
        label="유저ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        type="number"
      />
      <FormControl>
        <InputLabel id="plan-label">플랜</InputLabel>
        <Select
          labelId="plan-label"
          value={plan}
          label="플랜"
          onChange={(e) => setPlan(e.target.value)}
        >
          <MenuItem value="basic">basic</MenuItem>
          <MenuItem value="pro">pro</MenuItem>
          <MenuItem value="enterprise">enterprise</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="버전 (예: 2.3)"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
      />
      <TextField
        label="하드웨어ID"
        value={hardwareId}
        onChange={(e) => setHardwareId(e.target.value)}
      />
      <TextField
        label="만료일 (YYYY-MM-DD, 선택)"
        value={expireAt}
        onChange={(e) => setExpireAt(e.target.value)}
      />
      <Button variant="contained" onClick={handleIssue} disabled={loading}>
        인증키 발급
      </Button>
      {issuedToken && (
        <TextField
          label="발급된 인증키"
          value={issuedToken}
          InputProps={{ readOnly: true }}
          multiline
          minRows={2}
        />
      )}
      {result && (
        <Typography color={result.includes("성공") ? "primary" : "error"}>
          {result}
        </Typography>
      )}
    </Box>
  );
};

export default LicenseIssue;
