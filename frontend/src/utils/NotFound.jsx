// NotFound.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const handleGoHome = () => {
    navigate("/"); // Use navigate to redirect to the home page
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: theme.palette.background.default,
        padding: 2,
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Oops! Page not found.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoHome}>
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
