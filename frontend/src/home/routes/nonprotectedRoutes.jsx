import { Route, Navigate } from "react-router-dom";
import SignInPage from "../components/signIn/signInPage.jsx";
import NotFound from "../../utils/NotFound.jsx";

// Updated function to navigate based on user role
const navigateBasedOnRole = (role) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard"; // Return the path as a string
    case "teacher":
      return "/teacher/dashboard"; // Return the path as a string
    case "student":
      return "/student/dashboard"; // Return the path as a string
    case "super":
      return "/super/dashboard"; // Return the path as a string
    default:
      return "/"; // Redirect to home if role is unknown
  }
};

const nonprotectedRoutes = ({ isAuthenticated, userRole }) => {
  console.log("isAuthenticated:", isAuthenticated);
  console.log("userRole:", userRole);

  return [
    <Route
      path="/signin"
      element={
        !isAuthenticated ? (
          <SignInPage />
        ) : (
          <Navigate to={navigateBasedOnRole(userRole)} /> // Navigate to the correct path
        )
      }
      key="signin" // Always add a unique key for each Route
    />,
  ];
};

export default nonprotectedRoutes;
