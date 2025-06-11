import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Paper,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

interface FileUploaderProps {
  accept: string;
  maxSize: number; // bytes
  onUpload: (file: File) => Promise<void>;
  title?: string;
  description?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  maxSize,
  onUpload,
  title = "파일 업로드",
  description = "파일을 드래그하거나 클릭하여 업로드하세요.",
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);

    if (selectedFile.size > maxSize) {
      setError(`파일 크기는 ${maxSize / 1024 / 1024}MB를 초과할 수 없습니다.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      // 실제 업로드 진행 상황을 시뮬레이션
      const simulateProgress = () => {
        setUploadProgress((prev) => {
          if (prev >= 100) return prev;
          return prev + 10;
        });
      };
      const progressInterval = setInterval(simulateProgress, 500);

      await onUpload(file);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      setError("파일 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 1,
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: "background.default",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: "action.active", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {description}
        </Typography>
      </Box>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {file && (
        <Box sx={{ mt: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body2" noWrap sx={{ maxWidth: "70%" }}>
              {file.name}
            </Typography>
            <Box>
              <IconButton size="small" onClick={handleRemove} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          {uploading && (
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{ mt: 1 }}
            />
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={uploading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {uploading ? "업로드 중..." : "업로드"}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default FileUploader;
