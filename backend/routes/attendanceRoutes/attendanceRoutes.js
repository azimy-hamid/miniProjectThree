import express from "express";
import * as attendanceControllers from "../../controllers/attendanceControllers.js";

const attendanceRoutes = express.Router();

attendanceRoutes.post(
  "/create-attendance",
  attendanceControllers.createAttendance
);
attendanceRoutes.get(
  "/get-all-attendances",
  attendanceControllers.getAllAttendance
);
attendanceRoutes.get(
  "/get-specific-attendance/:attendanceId",
  attendanceControllers.getAttendanceById
);
attendanceRoutes.put(
  "/update-attendance-details-by-id/:attendanceId",
  attendanceControllers.updateAttendance
);
attendanceRoutes.delete(
  "/delete-attendance/:attendanceId",
  attendanceControllers.deleteAttendance
);
attendanceRoutes.put(
  "/recover-attendance-by-id/:attendanceId",
  attendanceControllers.recoverAttendance
);
attendanceRoutes.get(
  "/get-student-attendance-grouped-by-subject/:studentId",
  attendanceControllers.getStudentAttendanceGroupedBySubject
);

export default attendanceRoutes;
