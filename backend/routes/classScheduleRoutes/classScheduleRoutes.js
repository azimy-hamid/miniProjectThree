import express from "express";
import * as classScheduleControllers from "../../controllers/classScheduleControllers.js";

const classScheduleRoutes = express.Router();

classScheduleRoutes.post(
  "/create-class-schedule",
  classScheduleControllers.createClassSchedule
);
classScheduleRoutes.get(
  "/get-all-class-schedules",
  classScheduleControllers.getAllClassSchedules
);
classScheduleRoutes.get(
  "/get-specific-class-schedule/:classScheduleId",
  classScheduleControllers.getClassScheduleById
);
classScheduleRoutes.put(
  "/update-class-schedule-details-by-id/:classScheduleId",
  classScheduleControllers.updateClassSchedule
);
classScheduleRoutes.delete(
  "/delete-class-schedule/:classScheduleId",
  classScheduleControllers.deleteClassSchedule
);
classScheduleRoutes.put(
  "/recover-class-schedule-by-id/:classScheduleId",
  classScheduleControllers.recoverClassSchedule
);

export default classScheduleRoutes;
