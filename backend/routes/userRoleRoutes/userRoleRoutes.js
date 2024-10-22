import express from "express";
import * as roleController from "../../controllers/userRolesControllers.js";

const roleRoutes = express.Router();

roleRoutes.post("/create-role", roleController.createRole);
roleRoutes.post("/get-all-roles", roleController.getAllRoles);
roleRoutes.get("/get-role-by-id/:roleId", roleController.getRoleById);
roleRoutes.get("/get-role-by-name/:name", roleController.getRoleByName);
roleRoutes.put("/update-role/:roleId", roleController.updateRole);

roleRoutes.delete("/delete-role", roleController.deleteRole);

export default roleRoutes;
