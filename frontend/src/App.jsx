import "./App.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { CssBaseline } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import AppTheme from "./theme/AppTheme.jsx";
import HomeApp from "./home/HomeApp.jsx";
import NotFound from "./utils/NotFound.jsx";
import LoadingSpinner from "./utils/LoadingSpinner.jsx";

import homeRoutes from "./home/homeRoutes.jsx";
import superRoutes from "./priorityLevel/super/routes/superRoutes.jsx";
import adminRoutes from "./priorityLevel/admin/routes/adminRoutes.jsx";

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
      <NotFound />;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Change initial state to null
  const [userRole, setUserRole] = useState(null); // Track user role

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role"); // Assuming you have stored the role in local storage

    const verifyToken = async () => {
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      if (token) {
        try {
          // Send the role in the request body
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
            setIsAuthenticated(false);
            setUserRole(null);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppTheme>
  );
}

export default App;
