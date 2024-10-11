import express from "express";
import * as adminControllers from "../../controllers/adminController.js";
import authenticate from "../../middlewares/authenticate.js";

const adminRoutes = express.Router();

adminRoutes.post("/create-admin", adminControllers.createAdmin);
adminRoutes.get(
  "/get-all-admins",
  authenticate(["admin"]),
  adminControllers.getAllAdmins
);
adminRoutes.get(
  "/get-specific-admin/:adminId",
  authenticate(["admin"]),
  adminControllers.getAdminById
);
adminRoutes.delete(
  "/delete-admin",
  authenticate(["admin"]),
  adminControllers.deleteAdmin
);
// adminRoutes.put("/recover-user", adminControllers.recoverUser);

export default adminRoutes;
