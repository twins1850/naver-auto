import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import RefreshIcon from "@mui/icons-material/Refresh";

const StyledCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
  },
}));

const GradientCard = styled(Card)<{ gradient?: string }>(
  ({ theme, gradient }) => ({
    background: gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
    },
  })
);

const ValueText = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 700,
  color: "#ffffff",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  lineHeight: 1,
}));

const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  fontWeight: 500,
  color: "rgba(255, 255, 255, 0.9)",
  marginTop: theme.spacing(0.5),
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

const SubText = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: "rgba(255, 255, 255, 0.7)",
  marginTop: theme.spacing(1),
}));

export interface ModernCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  gradient?: string;
  icon?: React.ReactNode;
  onRefresh?: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

const ModernCard: React.FC<ModernCardProps> = ({
  title,
  value,
  subtitle,
  gradient,
  icon,
  onRefresh,
  loading = false,
  children,
}) => {
  const cardGradients = {
    blue: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    green: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    purple: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    orange: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    red: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  };

  return (
    <GradientCard gradient={gradient}>
      <CardContent sx={{ padding: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <LabelText>{title}</LabelText>
          </Box>
          {onRefresh && (
            <IconButton
              size="small"
              onClick={onRefresh}
              disabled={loading}
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                "&:hover": { color: "#ffffff" },
              }}
            >
              <RefreshIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          )}
        </Box>

        <ValueText>{loading ? "..." : value}</ValueText>

        {subtitle && <SubText>{subtitle}</SubText>}

        {children && <Box mt={2}>{children}</Box>}
      </CardContent>
    </GradientCard>
  );
};

export default ModernCard;
