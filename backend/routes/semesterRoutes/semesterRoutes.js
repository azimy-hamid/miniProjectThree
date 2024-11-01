import express from "express";
import * as semesterControllers from "../../controllers/semesterControllers.js";

const semesterRoutes = express.Router();

semesterRoutes.post("/create-semester", semesterControllers.createSemester);
semesterRoutes.get("/get-all-semesters", semesterControllers.getAllSemesters);
semesterRoutes.get(
  "/get-specific-semester/:semesterId",
  semesterControllers.getSemesterById
);
semesterRoutes.put(
  "/update-semester-details-by-id/:semesterId",
  semesterControllers.updateSemester
);
semesterRoutes.delete(
  "/delete-semester/:semesterId",
  semesterControllers.deleteSemester
);
semesterRoutes.put(
  "/recover-semester-by-id/:semesterId",
  semesterControllers.recoverSemester
);
semesterRoutes.get(
  "/get-all-semester-numbers",
  semesterControllers.getAllSemesterNumbers
);

export default semesterRoutes;
