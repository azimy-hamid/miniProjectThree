import express from "express";
import * as userController from "../../controllers/usersController.js";

const userRoutes = express.Router();

userRoutes.post("/signup-user", userController.signup);
userRoutes.post("/login-user", userController.login);
userRoutes.put("/update-user", userController.updateUser);
userRoutes.delete("/delete-user", userController.deleteUser);
userRoutes.put("/recover-user", userController.recoverUser);
userRoutes.get(
  "/check-user-exists/:email/:username",
  userController.checkUserExists
);

export default userRoutes;
