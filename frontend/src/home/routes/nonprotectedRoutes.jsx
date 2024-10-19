import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "../components/signIn/signInPage.jsx";

const nonprotectedRoutes = ({ isAuthenticated }) => {
  return [
    <Route
      path="/signin"
      element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignInPage />}
    />,
  ];
};

export default nonprotectedRoutes;
