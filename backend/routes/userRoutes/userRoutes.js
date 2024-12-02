import express from "express";
import * as userController from "../../controllers/usersController.js";
import authenticate from "../../middlewares/authenticate.js";

const userRoutes = express.Router();

userRoutes.post("/signup-user", authenticate(["admin"]), userController.signup);
userRoutes.post("/login-user", userController.login);
userRoutes.put(
  "/update-user",
  authenticate(["admin"]),
  userController.updateUser
);
userRoutes.delete(
  "/delete-user",
  authenticate(["admin"]),
  userController.deleteUser
);
userRoutes.put(
  "/recover-user",
  authenticate(["admin"]),
  userController.recoverUser
);
userRoutes.get(
  "/check-user-exists/:email/:username",
  userController.checkUserExists
);

export default userRoutes;
