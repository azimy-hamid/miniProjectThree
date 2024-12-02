import express from "express";
import * as studentControllers from "../../controllers/studentsControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const studentRoutes = express.Router();

studentRoutes.post(
  "/create-student",
  authenticate(["admin"]),
  studentControllers.createStudent
);
studentRoutes.get(
  "/get-all-students",
  authenticate(["admin"]),
  studentControllers.getAllStudents
);
studentRoutes.get(
  "/get-specific-student/:studentId",
  authenticate(["admin", "teacher", "student"]),
  studentControllers.getStudentById
);
studentRoutes.put(
  "/update-student-details-by-id/:studentId",
  authenticate(["admin"]),
  studentControllers.updateStudent
);
studentRoutes.delete(
  "/delete-student/:studentId",
  authenticate(["admin"]),
  studentControllers.deleteStudent
);
studentRoutes.put(
  "/recover-student-by-id/:studentId",
  authenticate(["admin"]),
  studentControllers.recoverStudent
);

studentRoutes.get(
  "/get-student-subjects/:studentId",
  authenticate(["admin", "teacher"]),
  studentControllers.getStudentSubjects
);

studentRoutes.get(
  "/get-number-of-students",
  authenticate(["admin"]),
  studentControllers.getNumberOfStudents
);

studentRoutes.get(
  "/get-all-student-codes",
  authenticate(["admin", "teacher"]),
  studentControllers.getAllStudentCodes
);

studentRoutes.get(
  "/get-student-by-code/:studentCode",
  authenticate(["admin", "teacher"]),
  studentControllers.getStudentByCode
);

studentRoutes.post(
  "/update-student-academic-history-status",
  authenticate(["admin", "teacher"]),
  studentControllers.updateStudentAcademicHistoryStatus
);

studentRoutes.post(
  "/update-multiple-students-academic-history-status",
  authenticate(["admin", "teacher"]),
  studentControllers.updateStudentsAcademicHistoryStatus
);

export default studentRoutes;
