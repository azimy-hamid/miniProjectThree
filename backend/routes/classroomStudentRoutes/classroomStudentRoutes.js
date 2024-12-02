import express from "express";
import * as classroomStudentControllers from "../../controllers/classroomStudentControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const classroomStudentRoutes = express.Router();

classroomStudentRoutes.post(
  "/add-student-to-classroom",
  authenticate(["admin"]),
  classroomStudentControllers.createClassroomStudent
);
classroomStudentRoutes.get(
  "/get-all-students-for-a-classroom",
  authenticate(["admin"]),
  classroomStudentControllers.getAllClassroomStudents
);
classroomStudentRoutes.get(
  "/get-specific-classroom/:classroomId",
  authenticate(["admin"]),
  classroomStudentControllers.getFeedbackById
);
classroomStudentRoutes.put(
  "/update-classroom-details-by-id-student/:classroomId",
  authenticate(["admin"]),
  classroomStudentControllers.updateFeedbackStudent
);
classroomStudentRoutes.delete(
  "/delete-classroom/:classroomId",
  authenticate(["admin"]),
  classroomStudentControllers.deleteFeedback
);
classroomStudentRoutes.put(
  "/recover-classroom-by-id/:classroomId",
  authenticate(["admin"]),
  classroomStudentControllers.recoverFeedback
);

classroomStudentRoutes.put(
  "/resolve-classroom-by-id/:classroomId",
  authenticate(["admin"]),
  classroomStudentControllers.resolveFeedback
);

export default classroomStudentRoutes;
