import React from "react";
import { Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard";
import SignInPage from "../../../home/components/signIn/signInPage";
import CreateAdminPage from "../pages/dashboard/CreateAdminPage";

const navigateBasedOnRole = (role) => {
  switch (role) {
    case "admin":
      return <Navigate to="/admin/dashboard" />;
    case "teacher":
      return <Navigate to="/teacher/dashboard" />;
    case "student":
      return <Navigate to="/student/dashboard" />;
    case "super":
      return <Dashboard />;
    default:
      return <Navigate to="/" />; // Default fallback
  }
};

const roleAllowed = "super";

const superRoutes = ({ isAuthenticated, userRole }) => {
  return [
    <Route
      path="/super/dashboard"
      element={
        isAuthenticated ? navigateBasedOnRole(userRole) : <Navigate to="/" />
      }
      key="super-dashboard"
    />,

    <Route
      path="/super/create-admin"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <CreateAdminPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="super-dashboard"
    />,
  ];
};

export default superRoutes;
