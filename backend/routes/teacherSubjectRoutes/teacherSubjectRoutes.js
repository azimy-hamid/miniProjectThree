import express from "express";
import * as teacherSubjectControllers from "../../controllers/teacherSubjectsControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const teacherSubjectRoutes = express.Router();

teacherSubjectRoutes.post(
  "/create-teacher-subject",
  authenticate(["admin"]),
  teacherSubjectControllers.createTeacherSubject
);
teacherSubjectRoutes.get(
  "/get-all-teacher-subjects",
  authenticate(["admin"]),
  teacherSubjectControllers.getAllTeacherSubjects
);
teacherSubjectRoutes.get(
  "/get-specific-teacher-subject/:teacherSubjectId",
  authenticate(["admin"]),
  teacherSubjectControllers.getTeacherSubjectById
);
teacherSubjectRoutes.put(
  "/update-teacher-subject-details-by-id/:teacherSubjectId",
  authenticate(["admin"]),
  teacherSubjectControllers.updateTeacherSubject
);
teacherSubjectRoutes.delete(
  "/delete-teacher-subject/:teacherSubjectId",
  authenticate(["admin"]),
  teacherSubjectControllers.deleteTeacherSubject
);
teacherSubjectRoutes.put(
  "/recover-teacher-subject-by-id/:teacherSubjectId",
  authenticate(["admin"]),
  teacherSubjectControllers.recoverTeacherSubject
);

export default teacherSubjectRoutes;
