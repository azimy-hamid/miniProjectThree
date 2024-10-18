import "./App.css";
import React, { useEffect, useState } from "react";
import { CssBaseline } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import SuperApp from "./priorityLevel/super/SuperApp.jsx";
import AppTheme from "./theme/AppTheme.jsx";
import HomeApp from "./home/HomeApp.jsx";
import SignIn from "./priorityLevel/super/reuseableComponents/signIn/SignInComponent.jsx";
import homeRoutes from "./home/homeRoutes.jsx";

// const API_URL = `${process.env.REACT_APP_API_BASE_URL}/verifyToken`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   const verifyToken = async () => {
  //     if (token) {
  //       try {
  //         const response = await axios.get(`${API_URL}`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });
  //         setIsAuthenticated(response.data.success);
  //       } catch (error) {
  //         console.error("Token verification failed:", error);
  //         setIsAuthenticated(false);
  //       }
  //     } else {
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   verifyToken();
  // }, []);

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
        {/* <homeRoutes isAuthenticated={isAuthenticated} /> */}
      </Routes>

      {/* <SignIn /> */}
    </AppTheme>
  );
}

export default App;
