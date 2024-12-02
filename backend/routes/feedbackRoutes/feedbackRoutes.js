import express from "express";
import * as feedbackControllers from "../../controllers/feedbackControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const feedbackRoutes = express.Router();

feedbackRoutes.post(
  "/create-feedback",
  authenticate(["admin"]),
  feedbackControllers.createFeedback
);
feedbackRoutes.get(
  "/get-all-feedback",
  authenticate(["admin"]),
  feedbackControllers.getAllFeedbacks
);
feedbackRoutes.get(
  "/get-specific-feedback/:feedbackId",
  authenticate(["admin"]),
  feedbackControllers.getFeedbackById
);
feedbackRoutes.put(
  "/update-feedback-details-by-id-student/:feedbackId",
  authenticate(["admin"]),
  feedbackControllers.updateFeedbackStudent
);
feedbackRoutes.delete(
  "/delete-feedback/:feedbackId",
  authenticate(["admin"]),
  feedbackControllers.deleteFeedback
);
feedbackRoutes.put(
  "/recover-feedback-by-id/:feedbackId",
  authenticate(["admin"]),
  feedbackControllers.recoverFeedback
);

feedbackRoutes.put(
  "/resolve-feedback-by-id/:feedbackId",
  authenticate(["admin"]),
  feedbackControllers.resolveFeedback
);

export default feedbackRoutes;
