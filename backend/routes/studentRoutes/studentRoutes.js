import express from "express";
import * as studentControllers from "../../controllers/studentsController.js";

const studentRoutes = express.Router();

studentRoutes.post("/create-student", studentControllers.createStudent);
studentRoutes.get("/get-all-students", studentControllers.getAllStudents);
studentRoutes.get(
  "/get-specific-student/:studentId",
  studentControllers.getStudentById
);
studentRoutes.put(
  "/update-student-details-by-id/:studentId",
  studentControllers.updateStudent
);
studentRoutes.delete(
  "/delete-student/:studentId",
  studentControllers.deleteStudent
);
studentRoutes.put(
  "/recover-student/:studentId",
  studentControllers.recoverStudent
);

export default studentRoutes;
