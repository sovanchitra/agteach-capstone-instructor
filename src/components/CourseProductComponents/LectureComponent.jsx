import { Delete } from "@mui/icons-material";
import { Box, Typography, TextField, Stack } from "@mui/material";

import { styled } from "@mui/material/styles";
import { useRef } from "react";

import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const style = {
  backgroundColor: "grey.300",
  display: "flex",
  alignItems: "center",
  padding: "36px",
  border: "2px dashed grey",
  cursor: "pointer",
  my: 0,
};

export default function LectureComponent({ id, onDelete , number }) {
  const lectureInputRef = useRef(null);

  const handleClick = () => {
    if (lectureInputRef.current) {
      lectureInputRef.current.click();
    }
  };

  return (
    <Box sx={{ alignItems: "center", paddingTop: 4 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="bmdr">
          <strong>Lecture {number}:</strong> Write your lecture title below
        </Typography>
        <Delete
          color="red"
          onClick={() => onDelete(id)} // Call the onDelete handler passed from parent
        />
      </Stack>
      <TextField
        fullWidth
        label="Title of Lecture"
        sx={{ my: 2 }}
        variant="outlined"
      />
      <Stack sx={style} onClick={handleClick}>
        <UploadFileOutlinedIcon color="grey" />
        <Typography color="grey">Upload Lecture Video</Typography>
        <VisuallyHiddenInput
          ref={lectureInputRef}
          type="file"
          multiple
          sx={{ display: "none" }}
        />
      </Stack>
    </Box>
  );
}
