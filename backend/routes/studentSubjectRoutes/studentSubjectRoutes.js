import express from "express";
import * as studentSubjectControllers from "../../controllers/studentSubjectControllers.js";

const studentSubjectRoutes = express.Router();

studentSubjectRoutes.post(
  "/create-student-subject",
  studentSubjectControllers.createStudentSubject
);
studentSubjectRoutes.get(
  "/get-all-student-subject",
  studentSubjectControllers.getAllStudentSubjects
);
studentSubjectRoutes.get(
  "/get-specific-student-subject/:subjectId",
  studentSubjectControllers.getStudentSubjectById
);
studentSubjectRoutes.put(
  "/update-student-subject-details-by-id/:subjectId",
  studentSubjectControllers.updateStudentSubject
);
studentSubjectRoutes.delete(
  "/delete-student-subject/:subjectId",
  studentSubjectControllers.deleteStudentSubject
);
studentSubjectRoutes.put(
  "/recover-student-subject-by-id/:subjectId",
  studentSubjectControllers.recoverStudentSubject
);

export default studentSubjectRoutes;
