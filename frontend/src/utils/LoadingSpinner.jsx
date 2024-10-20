import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const LoadingSpinner = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        bgcolor: theme.palette.background.default, // Use the theme background color
        padding: 2,
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export default LoadingSpinner;
