import express from "express";
import * as attendanceControllers from "../../controllers/attendanceControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const attendanceRoutes = express.Router();

attendanceRoutes.post(
  "/create-attendance",
  authenticate(["teacher"]),
  attendanceControllers.createAttendance
);
attendanceRoutes.get(
  "/get-all-attendances",
  authenticate(["teacher", "student"]),
  attendanceControllers.getAllAttendance
);
attendanceRoutes.get(
  "/get-specific-attendance/:attendanceId",
  authenticate(["teacher"]),
  attendanceControllers.getAttendanceById
);
attendanceRoutes.put(
  "/update-attendance-details-by-id/:attendanceId",
  authenticate(["teacher"]),
  attendanceControllers.updateAttendance
);
attendanceRoutes.delete(
  "/delete-attendance/:attendanceId",
  authenticate(["teacher"]),
  attendanceControllers.deleteAttendance
);
attendanceRoutes.put(
  "/recover-attendance-by-id/:attendanceId",
  authenticate(["teacher"]),
  attendanceControllers.recoverAttendance
);
attendanceRoutes.get(
  "/get-student-attendance-grouped-by-subject/:studentId",
  authenticate(["teacher", "student"]),
  attendanceControllers.getStudentAttendanceGroupedBySubject
);

export default attendanceRoutes;
