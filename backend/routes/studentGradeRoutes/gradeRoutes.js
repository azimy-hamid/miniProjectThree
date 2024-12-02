import express from "express";
import * as gradeControllers from "../../controllers/gradeControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const gradeRoutes = express.Router();

// Create a new grade record
gradeRoutes.post(
  "/create-grade",
  authenticate(["admin", "teacher"]),
  gradeControllers.createGrade
);

// Get all grades
gradeRoutes.get(
  "/get-all-grades",
  authenticate(["admin", "teacher"]),
  gradeControllers.getAllGrades
);

// Get a specific grade by ID
gradeRoutes.get(
  "/get-grade-by-id/:gradeId",
  authenticate(["admin", "teacher"]),
  gradeControllers.getGradeById
);

// Update grade details by ID
gradeRoutes.put(
  "/update-grade-details-by-id/:gradeId",
  authenticate(["admin", "teacher"]),
  gradeControllers.updateGrade
);

// Soft delete a grade by ID
gradeRoutes.delete(
  "/delete-grade/:gradeId",
  authenticate(["admin", "teacher"]),
  gradeControllers.deleteGrade
);

// Recover a deleted grade by ID
gradeRoutes.put(
  "/recover-grade-by-id/:gradeId",
  authenticate(["admin", "teacher"]),
  gradeControllers.recoverGrade
);
gradeRoutes.get(
  "/get-all-grade-codes",
  authenticate(["admin", "teacher"]),
  gradeControllers.getAllGradeCodes
);

export default gradeRoutes;
