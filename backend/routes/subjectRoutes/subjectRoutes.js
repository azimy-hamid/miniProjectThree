import express from "express";
import * as subjectControllers from "../../controllers/subjectControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const subjectRoutes = express.Router();

subjectRoutes.post(
  "/create-subject",
  authenticate(["admin"]),
  subjectControllers.createSubject
);
subjectRoutes.get(
  "/get-all-subjects",
  authenticate(["admin"]),
  subjectControllers.getAllSubjects
);
subjectRoutes.get(
  "/get-specific-subject/:subjectId",
  authenticate(["admin", "teacher", "student"]),
  subjectControllers.getSubjectById
);
subjectRoutes.put(
  "/update-subject-details-by-id/:subjectId",
  authenticate(["admin"]),
  subjectControllers.updateSubject
);
subjectRoutes.delete(
  "/delete-subject/:subjectId",
  authenticate(["admin"]),
  subjectControllers.deleteSubject
);
subjectRoutes.put(
  "/recover-subject-by-id/:subjectId",
  authenticate(["admin"]),
  subjectControllers.recoverSubject
);
subjectRoutes.get(
  "/get-all-subject-codes",
  authenticate(["admin", "teacher"]),
  subjectControllers.getAllSubjectCodes
);
subjectRoutes.get(
  "/get-only-one-subject-details/:subjectId",
  authenticate(["admin", "teacher"]),
  subjectControllers.getOnlyOneSubjectDetails
);

subjectRoutes.get(
  "/get-students-for-subject/:subjectId",
  authenticate(["admin", "teacher"]),
  subjectControllers.getStudentsForSubject
);

subjectRoutes.get(
  "/get-subjects-for-student/:studentId",
  authenticate(["admin", "teacher", "student"]),
  subjectControllers.getSubjectsForStudent
);

export default subjectRoutes;
