import React from "react";
import { Routes } from "react-router-dom";

import nonprotectedRoutes from "./routes/unprotectedRoutes.jsx";

function homeRoutes({ isAuthenticated }) {
  return (
    <>
      <nonprotectedRoutes isAuthenticated={isAuthenticated} />
    </>
  );
}

export default homeRoutes;
