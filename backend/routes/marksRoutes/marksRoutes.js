import express from "express";
import * as marksControllers from "../../controllers/marksControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const marksRoutes = express.Router();

marksRoutes.post(
  "/create-mark",
  authenticate(["admin", "teacher"]),
  marksControllers.createMark
);
marksRoutes.get(
  "/get-all-marks",
  authenticate(["admin", "teacher"]),
  marksControllers.getAllMarks
);
marksRoutes.get(
  "/get-specific-mark/:markId",
  authenticate(["admin", "teacher"]),
  marksControllers.getMarkById
);
marksRoutes.put(
  "/update-mark-details-by-id-teacher/:markId",
  authenticate(["admin", "teacher"]),
  marksControllers.updateMark
);
marksRoutes.delete(
  "/delete-mark/:markId",
  authenticate(["admin", "teacher"]),
  marksControllers.deleteMark
);
marksRoutes.put(
  "/recover-mark-by-id/:markId",
  authenticate(["admin", "teacher"]),
  marksControllers.recoverMark
);

export default marksRoutes;
