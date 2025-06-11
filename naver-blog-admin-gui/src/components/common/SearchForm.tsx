import React from "react";
import { Paper, Box } from "@mui/material";

interface SearchFormProps {
  query: {
    name: string;
    email: string;
    plan: string;
    status: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  nameSuggests: string[];
  emailSuggests: string[];
  onSuggestClick: (field: "name" | "email", value: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  query,
  onChange,
  onSearch,
  nameSuggests,
  emailSuggests,
  onSuggestClick,
}) => (
  <Paper sx={{ mb: 2, p: 2, display: "flex", gap: 2, position: "relative" }}>
    <Box sx={{ position: "relative" }}>
      <input
        name="name"
        placeholder="이름"
        value={query.name}
        onChange={onChange}
        style={{ marginRight: 8 }}
        autoComplete="off"
      />
      {nameSuggests.length > 0 && (
        <Paper
          sx={{ position: "absolute", zIndex: 10, mt: 5, ml: 1, width: 160 }}
        >
          {nameSuggests.map((s) => (
            <Box
              key={s}
              sx={{ p: 1, cursor: "pointer" }}
              onClick={() => onSuggestClick("name", s)}
            >
              {s}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
    <Box sx={{ position: "relative" }}>
      <input
        name="email"
        placeholder="이메일"
        value={query.email}
        onChange={onChange}
        style={{ marginRight: 8 }}
        autoComplete="off"
      />
      {emailSuggests.length > 0 && (
        <Paper
          sx={{ position: "absolute", zIndex: 10, mt: 5, ml: 1, width: 200 }}
        >
          {emailSuggests.map((s) => (
            <Box
              key={s}
              sx={{ p: 1, cursor: "pointer" }}
              onClick={() => onSuggestClick("email", s)}
            >
              {s}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
    <input
      name="plan"
      placeholder="플랜"
      value={query.plan}
      onChange={onChange}
      style={{ marginRight: 8 }}
      autoComplete="off"
    />
    <input
      name="status"
      placeholder="상태"
      value={query.status}
      onChange={onChange}
      style={{ marginRight: 8 }}
      autoComplete="off"
    />
    <button onClick={onSearch}>검색</button>
  </Paper>
);

export default SearchForm;
