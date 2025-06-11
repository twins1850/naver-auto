import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  IconButton,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

interface FileUploaderProps {
  accept?: string;
  maxSize?: number; // in bytes
  onUpload: (file: File) => Promise<void>;
  title?: string;
  description?: string;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  accept = "*/*",
  maxSize = 100 * 1024 * 1024, // 100MB default
  onUpload,
  title = "파일 업로드",
  description = "파일을 드래그하거나 클릭하여 업로드하세요.",
  multiple = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      setError(`파일 크기는 ${maxSize / 1024 / 1024}MB를 초과할 수 없습니다.`);
      return false;
    }

    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileType = file.type || "";
      const isValidType = acceptedTypes.some((type) =>
        fileType.startsWith(type.replace("*", "")),
      );

      if (!isValidType) {
        setError("지원하지 않는 파일 형식입니다.");
        return false;
      }
    }

    return true;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      try {
        setUploading(true);
        // 실제 업로드 진행 상황을 시뮬레이션
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 200);

        await onUpload(file);
        setUploadProgress(100);
      } catch (error) {
        setError("파일 업로드 중 오류가 발생했습니다.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        try {
          setUploading(true);
          await onUpload(file);
        } catch (error) {
          setError("파일 업로드 중 오류가 발생했습니다.");
        } finally {
          setUploading(false);
        }
      }
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        backgroundColor: dragActive ? "action.hover" : "background.paper",
        transition: "background-color 0.2s",
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: "none" }}
        multiple={multiple}
      />

      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>

        <Button
          variant="contained"
          onClick={handleButtonClick}
          disabled={uploading}
        >
          파일 선택
        </Button>

        {selectedFile && (
          <Box width="100%" mt={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body2" noWrap sx={{ maxWidth: "70%" }}>
                {selectedFile.name}
              </Typography>
              <IconButton size="small" onClick={handleRemoveFile}>
                <DeleteIcon />
              </IconButton>
            </Box>
            {uploading && (
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        )}

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default FileUploader;
