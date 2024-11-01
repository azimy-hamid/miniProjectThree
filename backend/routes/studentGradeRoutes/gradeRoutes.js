import express from "express";
import * as gradeControllers from "../../controllers/gradeControllers.js";

const gradeRoutes = express.Router();

// Create a new grade record
gradeRoutes.post("/create-grade", gradeControllers.createGrade);

// Get all grades
gradeRoutes.get("/get-all-grades", gradeControllers.getAllGrades);

// Get a specific grade by ID
gradeRoutes.get("/get-grade-by-id/:gradeId", gradeControllers.getGradeById);

// Update grade details by ID
gradeRoutes.put(
  "/update-grade-details-by-id/:gradeId",
  gradeControllers.updateGrade
);

// Soft delete a grade by ID
gradeRoutes.delete("/delete-grade/:gradeId", gradeControllers.deleteGrade);

// Recover a deleted grade by ID
gradeRoutes.put("/recover-grade-by-id/:gradeId", gradeControllers.recoverGrade);
gradeRoutes.get("/get-all-grade-codes", gradeControllers.getAllGradeCodes);

export default gradeRoutes;
