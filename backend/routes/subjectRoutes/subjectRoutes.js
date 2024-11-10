import express from "express";
import * as subjectControllers from "../../controllers/subjectControllers.js";

const subjectRoutes = express.Router();

subjectRoutes.post("/create-subject", subjectControllers.createSubject);
subjectRoutes.get("/get-all-subjects", subjectControllers.getAllSubjects);
subjectRoutes.get(
  "/get-specific-subject/:subjectId",
  subjectControllers.getSubjectById
);
subjectRoutes.put(
  "/update-subject-details-by-id/:subjectId",
  subjectControllers.updateSubject
);
subjectRoutes.delete(
  "/delete-subject/:subjectId",
  subjectControllers.deleteSubject
);
subjectRoutes.put(
  "/recover-subject-by-id/:subjectId",
  subjectControllers.recoverSubject
);
subjectRoutes.get(
  "/get-all-subject-codes",
  subjectControllers.getAllSubjectCodes
);
subjectRoutes.get(
  "/get-only-one-subject-details/:subjectId",
  subjectControllers.getOnlyOneSubjectDetails
);

subjectRoutes.get(
  "/get-students-for-subject/:subjectId",
  subjectControllers.getStudentsForSubject
);

subjectRoutes.get(
  "/get-subjects-for-student/:studentId",
  subjectControllers.getSubjectsForStudent
);

export default subjectRoutes;
