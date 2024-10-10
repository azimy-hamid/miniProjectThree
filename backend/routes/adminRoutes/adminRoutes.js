import express from "express";
import * as adminControllers from "../../controllers/adminController.js";

const adminRoutes = express.Router();

adminRoutes.post("/create-admin", adminControllers.createAdmin);
adminRoutes.get("/get-all-admins", adminControllers.getAllAdmins);
adminRoutes.put("/get-specific-admin:adminId", adminControllers.getAdminById);
adminRoutes.delete("/delete-admin", adminControllers.deleteAdmin);
// adminRoutes.put("/recover-user", adminControllers.recoverUser);

export default adminRoutes;
