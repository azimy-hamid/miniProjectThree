import express from "express";
import * as studentGradeControllers from "../../controllers/studentGradeControllers.js";

const studentGradeRoutes = express.Router();

studentGradeRoutes.post(
  "/create-student-grade",
  studentGradeControllers.createStudentGrade
);
studentGradeRoutes.get(
  "/get-all-student-grades",
  studentGradeControllers.getAllStudentGrades
);
studentGradeRoutes.get(
  "/get-specific-student-grade/:gradeId",
  studentGradeControllers.getStudentGradeById
);
studentGradeRoutes.put(
  "/update-student-grade-details-by-id/:gradeId",
  studentGradeControllers.updateStudentGrade
);
studentGradeRoutes.delete(
  "/delete-student-grade/:gradeId",
  studentGradeControllers.deleteStudentGrade
);
studentGradeRoutes.put(
  "/recover-student-grade-by-id/:gradeId",
  studentGradeControllers.recoverStudentGrade
);

export default studentGradeRoutes;
