import express from "express";
import * as roleController from "../../controllers/userRolesControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const roleRoutes = express.Router();

roleRoutes.post(
  "/create-role",
  authenticate(["admin"]),
  roleController.createRole
);
roleRoutes.get(
  "/get-all-roles",
  authenticate(["admin"]),
  roleController.getAllRoles
);
roleRoutes.get(
  "/get-role-by-id/:roleId",
  authenticate(["admin"]),
  roleController.getRoleById
);
roleRoutes.get(
  "/get-role-by-name/:name",
  authenticate(["admin"]),
  roleController.getRoleByName
);
roleRoutes.put(
  "/update-role/:roleId",
  authenticate(["admin"]),
  roleController.updateRole
);

roleRoutes.delete(
  "/delete-role",
  authenticate(["admin"]),
  roleController.deleteRole
);

export default roleRoutes;
