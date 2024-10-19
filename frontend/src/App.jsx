import "./App.css";
import React, { useEffect, useState } from "react";
import { CssBaseline } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import SuperApp from "./priorityLevel/super/SuperApp.jsx";
import AppTheme from "./theme/AppTheme.jsx";
import HomeApp from "./home/HomeApp.jsx";
import SignIn from "./home/components/signIn/SignInComponent.jsx";
import homeRoutes from "./home/homeRoutes.jsx";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/verifyToken`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Change initial state to null
  const [userRole, setUserRole] = useState(null); // Track user role

  useEffect(() => {
    const token = localStorage.getItem("token");
    const API_URL = `${process.env.REACT_APP_API_BASE_URL}/verifyToken`; // Make sure your API_URL is set correctly

    const verifyToken = async () => {
      if (token) {
        try {
          // Get the role from local storage or define it
          const storedRole = localStorage.getItem("role"); // Assuming you have stored the role in local storage

          const response = await axios.get(API_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
              Role: storedRole, // Send the role in the headers for verification
            },
          });

          if (response.data.success) {
            setIsAuthenticated(true);
            setUserRole(response.data.user.role); // Assuming the backend returns the user object with role
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
    return <div>Loading...</div>;
  }

  return (
    <AppTheme>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <HomeApp />}
        />
        {homeRoutes({ isAuthenticated, userRole }).map((route, index) => (
          <React.Fragment key={index}>{route}</React.Fragment>
        ))}
      </Routes>
    </AppTheme>
  );
}

export default App;
