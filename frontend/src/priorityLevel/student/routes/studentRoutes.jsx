import React from "react";
import { Route, Navigate } from "react-router-dom";

import StudentDashboard from "../pages/dashboard/StudentDashboard.jsx";
import AttendanceDetailsPage from "../pages/dashboard/AttendanceDetailsPage.jsx";

const navigateBasedOnRole = (role) => {
  switch (role) {
    case "super":
      return <Navigate to="/super/dashboard" />;
    case "admin":
      return <Navigate to="/admin/dashboard" />;
    case "teacher":
      return <Navigate to="/teacher/dashboard" />;
    case "student":
      return <StudentDashboard />;
    default:
      return <Navigate to="/" />; // Default fallback
  }
};

const roleAllowed = "student";

const studentRoutes = ({ isAuthenticated, userRole }) => {
  return [
    // student dashboard routes
    <Route
      path="/student/dashboard"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          navigateBasedOnRole(userRole)
        ) : (
          <Navigate to="/" />
        )
      }
      key="student-dashboard"
    />,

    <Route
      path="/student/attendance-details/:subjectId"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <AttendanceDetailsPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="student-dashboard"
    />,
  ];
};

export default studentRoutes;
