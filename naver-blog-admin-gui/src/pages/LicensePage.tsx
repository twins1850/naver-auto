import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import LicenseIssue from "../components/common/LicenseIssue";
import LicenseValidate from "../components/common/LicenseValidate";
import LicenseList from "../components/common/LicenseList";

const LicensePage: React.FC = () => {
  const [tab, setTab] = useState(0);
  return (
    <Paper sx={{ maxWidth: 900, margin: "auto", mt: 4, p: 2 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
        <Tab label="인증키 발급" />
        <Tab label="인증키 검증" />
        <Tab label="인증키 목록" />
      </Tabs>
      <Box mt={3}>
        {tab === 0 && <LicenseIssue />}
        {tab === 1 && <LicenseValidate />}
        {tab === 2 && <LicenseList />}
      </Box>
    </Paper>
  );
};

export default LicensePage;
