import React from "react";
import { Route, Navigate } from "react-router-dom";

import AdminDashboard from "../pages/dashboard/AdminDashboard";
import CreateTeacherPage from "../pages/dashboard/CreateTeacherPage";
import TeacherOverviewPage from "../pages/dashboard/TeacherOverviewPage";
import TeacherDetailsPage from "../pages/dashboard/TeacherDetailsPage";

const navigateBasedOnRole = (role) => {
  switch (role) {
    case "super":
      return <Navigate to="/admin/dashboard" />;
    case "teacher":
      return <Navigate to="/teacher/dashboard" />;
    case "student":
      return <Navigate to="/student/dashboard" />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <Navigate to="/" />; // Default fallback
  }
};

const roleAllowed = "admin";

const adminRoutes = ({ isAuthenticated, userRole }) => {
  return [
    <Route
      path="/admin/dashboard"
      element={
        isAuthenticated ? navigateBasedOnRole(userRole) : <Navigate to="/" />
      }
      key="admin-dashboard"
    />,

    <Route
      path="/admin/create-teacher"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <CreateTeacherPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-create-teacher-form"
    />,

    <Route
      path="/admin/teacher-overview"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <TeacherOverviewPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-create-teacher-form"
    />,

    <Route
      path="/admin/teacher-details"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <TeacherDetailsPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-create-teacher-form"
    />,
  ];
};

export default adminRoutes;
