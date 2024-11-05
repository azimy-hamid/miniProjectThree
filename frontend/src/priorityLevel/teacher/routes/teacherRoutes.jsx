import React from "react";
import { Route, Navigate } from "react-router-dom";

import TeacherDashboard from "../pages/dashboard/TeacherDashboard.jsx";
import TeacherSubjectsOverviewPage from "../pages/dashboard/TeacherSubjectsOverviewPage.jsx";
import SubjectDetailsPage from "../pages/dashboard/SubjectDetailsPage.jsx";

const navigateBasedOnRole = (role) => {
  switch (role) {
    case "super":
      return <Navigate to="/super/dashboard" />;
    case "admin":
      return <Navigate to="/admin/dashboard" />;
    case "student":
      return <Navigate to="/student/dashboard" />;
    case "teacher":
      return <TeacherDashboard />;
    default:
      return <Navigate to="/" />; // Default fallback
  }
};

const roleAllowed = "teacher";

const teacherRoutes = ({ isAuthenticated, userRole }) => {
  return [
    // admin dashboard routes
    <Route
      path="/teacher/dashboard"
      element={
        isAuthenticated ? navigateBasedOnRole(userRole) : <Navigate to="/" />
      }
      key="teacher-dashboard"
    />,

    // subjects routes
    <Route
      path="/teacher/subject-overview"
      element={
        isAuthenticated ? <TeacherSubjectsOverviewPage /> : <Navigate to="/" />
      }
      key="teacher-subject-overview"
    />,

    <Route
      path="/teacher/subject-details/:subjectId"
      element={isAuthenticated ? <SubjectDetailsPage /> : <Navigate to="/" />}
      key="teacher-subject-overview"
    />,
  ];
};

export default teacherRoutes;
