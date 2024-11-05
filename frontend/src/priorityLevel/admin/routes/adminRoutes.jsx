import React from "react";
import { Route, Navigate } from "react-router-dom";

import AdminDashboard from "../pages/dashboard/AdminDashboard";
import CreateTeacherPage from "../pages/dashboard/CreateTeacherPage";
import TeacherOverviewPage from "../pages/dashboard/TeacherOverviewPage";
import TeacherDetailsPage from "../pages/dashboard/TeacherDetailsPage";
import CreateStudentPage from "../pages/dashboard/CreateStudentPage";
import CreateClassroomPage from "../pages/dashboard/CreateClassroomPage";
import CreateSubjectPage from "../pages/dashboard/CreateSubjectPage";
import CreateClassSchedulePage from "../pages/dashboard/CreateClassSchedulePage";
import UpdateTeacherPage from "../pages/dashboard/UpdateTeacherPage";
import ClassroomOverviewPage from "../pages/dashboard/ClassroomOverviewPage";
import ClassroomDetailsPage from "../pages/dashboard/ClassroomDetailsPage";
import SubjectOverviewPage from "../pages/dashboard/SubjectOverviewPage";
import SubjectDetailsPage from "../pages/dashboard/SubjectDetailsPage";
import StudentOverviewPage from "../pages/dashboard/StudentOverviewPage";
import StudentDetailsPage from "../pages/dashboard/StudentDetailsPage";
import ManageFeesPage from "../pages/dashboard/ManageFeesPage";

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
    // admin dashboard routes
    <Route
      path="/admin/dashboard"
      element={
        isAuthenticated ? navigateBasedOnRole(userRole) : <Navigate to="/" />
      }
      key="admin-dashboard"
    />,
    // teacher routes
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
      key="admin-teacher-overview"
    />,

    <Route
      path="/admin/teacher-details/:teacherId"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <TeacherDetailsPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-create-teacher-form"
    />,

    <Route
      path="/admin/update-teacher/:teacherId"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <UpdateTeacherPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-update-teacher-form"
    />,

    // student routes
    <Route
      path="/admin/create-student"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <CreateStudentPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-create-teacher-form"
    />,

    <Route
      path="/admin/student-overview"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <StudentOverviewPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-student-overview"
    />,

    <Route
      path="/admin/student-details/:studentId"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <StudentDetailsPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-student-overview"
    />,

    // classroom routes
    <Route
      path="/admin/classroom-overview"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <ClassroomOverviewPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-classroom-overview-page"
    />,

    <Route
      path="/admin/create-classroom"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <CreateClassroomPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-create-classroom-page"
    />,

    <Route
      path="/admin/create-class-schedule"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <CreateClassSchedulePage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-create-class-schedule-page"
    />,

    <Route
      path="/admin/classroom-details/:classroomId"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <ClassroomDetailsPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-create-class-schedule-page"
    />,

    // subject routes
    <Route
      path="/admin/create-subject"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <CreateSubjectPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-create-teacher-form"
    />,

    <Route
      path="/admin/subject-overview"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <SubjectOverviewPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-subject-overview"
    />,

    <Route
      path="/admin/subject-details/:subjectId"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <SubjectDetailsPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-subject-overview"
    />,

    // fees routes
    <Route
      path="/admin/manage-fees"
      element={
        isAuthenticated && userRole === roleAllowed ? (
          <ManageFeesPage />
        ) : (
          <Navigate to="/" />
        )
      }
      key="admin-subject-overview"
    />,
  ];
};

export default adminRoutes;
