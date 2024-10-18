import { Route, Navigate } from "react-router-dom";
import SignIn from "../../priorityLevel/super/reuseableComponents/signIn/SignInComponent";

const nonprotectedRoutes = ({ isAuthenticated }) => {
  return (
    <>
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />}
      />
    </>
  );
};

export default nonprotectedRoutes;
