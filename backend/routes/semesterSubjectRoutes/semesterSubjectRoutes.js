import express from "express";
import * as semesterSubjectControllers from "../../controllers/semesterSubjectControllers.js";

const semesterSubjectRoutes = express.Router();

semesterSubjectRoutes.post(
  "/create-semester-subject",
  semesterSubjectControllers.createSemesterSubject
);
semesterSubjectRoutes.get(
  "/get-all-semester-subjects",
  semesterSubjectControllers.getAllSemesterSubjects
);
semesterSubjectRoutes.get(
  "/get-specific-semester-subject/:semesterSubjectId",
  semesterSubjectControllers.getSemesterSubjectById
);
semesterSubjectRoutes.put(
  "/update-semester-subject-details-by-id/:semesterSubjectId",
  semesterSubjectControllers.updateSemesterSubject
);
semesterSubjectRoutes.delete(
  "/delete-semester-subject/:semesterSubjectId",
  semesterSubjectControllers.deleteSemesterSubject
);
semesterSubjectRoutes.put(
  "/recover-semester-subject-by-id/:semesterSubjectId",
  semesterSubjectControllers.recoverSemesterSubject
);

export default semesterSubjectRoutes;
