import express from "express";
import * as teacherSubjectControllers from "../../controllers/teacherSubjectsControllers.js";

const teacherSubjectRoutes = express.Router();

teacherSubjectRoutes.post(
  "/create-teacher-subject",
  teacherSubjectControllers.createTeacherSubject
);
teacherSubjectRoutes.get(
  "/get-all-teacher-subjects",
  teacherSubjectControllers.getAllTeacherSubjects
);
teacherSubjectRoutes.get(
  "/get-specific-teacher-subject/:teacherSubjectId",
  teacherSubjectControllers.getTeacherSubjectById
);
teacherSubjectRoutes.put(
  "/update-teacher-subject-details-by-id/:teacherSubjectId",
  teacherSubjectControllers.updateTeacherSubject
);
teacherSubjectRoutes.delete(
  "/delete-teacher-subject/:teacherSubjectId",
  teacherSubjectControllers.deleteTeacherSubject
);
teacherSubjectRoutes.put(
  "/recover-teacher-subject-by-id/:teacherSubjectId",
  teacherSubjectControllers.recoverTeacherSubject
);

export default teacherSubjectRoutes;
