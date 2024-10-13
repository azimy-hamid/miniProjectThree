import express from "express";
import * as feedbackControllers from "../../controllers/feedbackControllers.js";

const feedbackRoutes = express.Router();

feedbackRoutes.post("/create-feedback", feedbackControllers.createFeedback);
feedbackRoutes.get("/get-all-feedback", feedbackControllers.getAllFeedbacks);
feedbackRoutes.get(
  "/get-specific-feedback/:feedbackId",
  feedbackControllers.getFeedbackById
);
feedbackRoutes.put(
  "/update-feedback-details-by-id-student/:feedbackId",
  feedbackControllers.updateFeedbackStudent
);
feedbackRoutes.delete(
  "/delete-feedback/:feedbackId",
  feedbackControllers.deleteFeedback
);
feedbackRoutes.put(
  "/recover-feedback-by-id/:feedbackId",
  feedbackControllers.recoverFeedback
);

feedbackRoutes.put(
  "/resolve-feedback-by-id/:feedbackId",
  feedbackControllers.resolveFeedback
);

export default feedbackRoutes;
