import React from "react";
import { Routes } from "react-router-dom";

import nonprotectedRoutes from "./routes/nonprotectedRoutes.jsx";

function homeRoutes({ isAuthenticated, userRole }) {
  return [...nonprotectedRoutes({ isAuthenticated, userRole })];
}

export default homeRoutes;
