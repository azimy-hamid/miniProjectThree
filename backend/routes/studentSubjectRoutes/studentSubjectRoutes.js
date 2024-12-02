import express from "express";
import * as studentSubjectControllers from "../../controllers/studentSubjectControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const studentSubjectRoutes = express.Router();

studentSubjectRoutes.post(
  "/create-student-subject",
  authenticate(["admin"]),
  studentSubjectControllers.createStudentSubject
);
studentSubjectRoutes.get(
  "/get-all-student-subject",
  authenticate(["admin"]),
  studentSubjectControllers.getAllStudentSubjects
);
studentSubjectRoutes.get(
  "/get-specific-student-subject/:subjectId",
  authenticate(["admin"]),
  studentSubjectControllers.getStudentSubjectById
);
studentSubjectRoutes.put(
  "/update-student-subject-details-by-id/:subjectId",
  authenticate(["admin"]),
  studentSubjectControllers.updateStudentSubject
);
studentSubjectRoutes.delete(
  "/delete-student-subject/:subjectId",
  authenticate(["admin"]),
  studentSubjectControllers.deleteStudentSubject
);
studentSubjectRoutes.put(
  "/recover-student-subject-by-id/:subjectId",
  authenticate(["admin"]),
  studentSubjectControllers.recoverStudentSubject
);

export default studentSubjectRoutes;
