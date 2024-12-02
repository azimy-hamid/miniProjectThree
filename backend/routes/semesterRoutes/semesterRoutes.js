import express from "express";
import * as semesterControllers from "../../controllers/semesterControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const semesterRoutes = express.Router();

semesterRoutes.post(
  "/create-semester",
  authenticate(["admin"]),
  semesterControllers.createSemester
);
semesterRoutes.get(
  "/get-all-semesters",
  authenticate(["admin", "teacher"]),
  semesterControllers.getAllSemesters
);
semesterRoutes.get(
  "/get-specific-semester/:semesterId",
  authenticate(["admin", "teacher"]),
  semesterControllers.getSemesterById
);
semesterRoutes.put(
  "/update-semester-details-by-id/:semesterId",
  authenticate(["admin"]),
  semesterControllers.updateSemester
);
semesterRoutes.delete(
  "/delete-semester/:semesterId",
  authenticate(["admin"]),
  semesterControllers.deleteSemester
);
semesterRoutes.put(
  "/recover-semester-by-id/:semesterId",
  authenticate(["admin"]),
  semesterControllers.recoverSemester
);
semesterRoutes.get(
  "/get-all-semester-numbers",
  authenticate(["admin", "teacher"]),
  semesterControllers.getAllSemesterNumbers
);

export default semesterRoutes;
