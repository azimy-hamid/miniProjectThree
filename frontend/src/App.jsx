import "./App.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { CssBaseline, Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import AppTheme from "./theme/AppTheme.jsx";
import HomeApp from "./home/HomeApp.jsx";
import NotFound from "./utils/NotFound.jsx";
import LoadingSpinner from "./utils/LoadingSpinner.jsx";

import homeRoutes from "./home/homeRoutes.jsx";
import superRoutes from "./priorityLevel/super/routes/superRoutes.jsx";
import adminRoutes from "./priorityLevel/admin/routes/adminRoutes.jsx";
import teacherRoutes from "./priorityLevel/teacher/routes/teacherRoutes.jsx";
import studentRoutes from "./priorityLevel/student/routes/studentRoutes.jsx";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/authanticate/verifyToken`;

function getDashboardRedirectPath(role) {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "student":
      return "/student/dashboard";
    case "super":
      return "/super/dashboard";
    default:
      return "/not-found"; // Return a valid path or use a NotFound component
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Change initial state to null
  const [userRole, setUserRole] = useState(null); // Track user role
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role"); // Assuming you have stored the role in local storage

    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.post(
            API_URL,
            { role: storedRole },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            setIsAuthenticated(true);
            setUserRole(response.data.roles[0]); // Assuming the backend returns an array of role names
          } else {
            // Set snackbar message if token is not valid
            setSnackbarMessage(
              "Session is invalid or has expired. Please log in again."
            );
            setSnackbarOpen(true);
            setIsAuthenticated(false);
            setUserRole(null);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          setSnackbarMessage("Authentication failed. Please log in again.");
          setSnackbarOpen(true);
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    verifyToken();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  return (
    <AppTheme>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRedirectPath(userRole)} />
            ) : (
              <HomeApp />
            )
          }
        />

        {homeRoutes({ isAuthenticated, userRole }).map((route, index) => (
          <React.Fragment key={index}>{route}</React.Fragment>
        ))}

        {superRoutes({ isAuthenticated, userRole }).map((route, index) => (
          <React.Fragment key={index}>{route}</React.Fragment>
        ))}

        {adminRoutes({ isAuthenticated, userRole }).map((route, index) => (
          <React.Fragment key={index}>{route}</React.Fragment>
        ))}

        {teacherRoutes({ isAuthenticated, userRole }).map((route, index) => (
          <React.Fragment key={index}>{route}</React.Fragment>
        ))}

        {studentRoutes({ isAuthenticated, userRole }).map((route, index) => (
          <React.Fragment key={index}>{route}</React.Fragment>
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Adjust as needed
      >
        <Alert onClose={handleCloseSnackbar} severity="warning">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
}

export default App;
