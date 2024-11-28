import express from "express";
import * as studentControllers from "../../controllers/studentsControllers.js";

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
  "/recover-student-by-id/:studentId",
  studentControllers.recoverStudent
);

studentRoutes.get(
  "/get-student-subjects/:studentId",
  studentControllers.getStudentSubjects
);

studentRoutes.get(
  "/get-number-of-students",
  studentControllers.getNumberOfStudents
);

studentRoutes.get(
  "/get-all-student-codes",
  studentControllers.getAllStudentCodes
);

studentRoutes.get(
  "/get-student-by-code/:studentCode",
  studentControllers.getStudentByCode
);

studentRoutes.post(
  "/update-student-academic-history-status",
  studentControllers.updateStudentAcademicHistoryStatus
);

studentRoutes.post(
  "/update-multiple-students-academic-history-status",
  studentControllers.updateStudentsAcademicHistoryStatus
);

export default studentRoutes;
