import express from "express";
import * as classroomStudentControllers from "../../controllers/classroomStudentControllers.js";

const classroomStudentRoutes = express.Router();

classroomStudentRoutes.post(
  "/add-student-to-classroom",
  classroomStudentControllers.createClassroomStudent
);
classroomStudentRoutes.get(
  "/get-all-students-for-a-classroom",
  classroomStudentControllers.getAllClassroomStudents
);
classroomStudentRoutes.get(
  "/get-specific-feedback/:feedbackId",
  classroomStudentControllers.getFeedbackById
);
classroomStudentRoutes.put(
  "/update-feedback-details-by-id-student/:feedbackId",
  classroomStudentControllers.updateFeedbackStudent
);
classroomStudentRoutes.delete(
  "/delete-feedback/:feedbackId",
  classroomStudentControllers.deleteFeedback
);
classroomStudentRoutes.put(
  "/recover-feedback-by-id/:feedbackId",
  classroomStudentControllers.recoverFeedback
);

classroomStudentRoutes.put(
  "/resolve-feedback-by-id/:feedbackId",
  classroomStudentControllers.resolveFeedback
);

export default classroomStudentRoutes;
