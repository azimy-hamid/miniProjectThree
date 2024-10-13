import express from "express";
import * as marksControllers from "../../controllers/marksControllers.js";

const marksRoutes = express.Router();

marksRoutes.post("/create-mark", marksControllers.createMark);
marksRoutes.get("/get-all-marks", marksControllers.getAllMarks);
marksRoutes.get("/get-specific-mark/:markId", marksControllers.getMarkById);
marksRoutes.put(
  "/update-mark-details-by-id-teacher/:markId",
  marksControllers.updateMark
);
marksRoutes.delete("/delete-mark/:markId", marksControllers.deleteMark);
marksRoutes.put("/recover-mark-by-id/:markId", marksControllers.recoverMark);

export default marksRoutes;
