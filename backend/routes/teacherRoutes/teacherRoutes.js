import express from "express";
import * as teacherControllers from "../../controllers/teacherControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const teacherRoutes = express.Router();

teacherRoutes.post(
  "/create-teacher",
  authenticate(["admin"]),
  teacherControllers.createTeacher
);
teacherRoutes.get(
  "/get-all-teachers",
  authenticate(["admin"]),
  teacherControllers.getAllTeachers
);
teacherRoutes.get(
  "/get-specific-teacher/:teacherId",
  authenticate(["admin", "teacher"]),
  teacherControllers.getTeacherById
);
teacherRoutes.put(
  "/update-teacher-details-by-id/:teacherId",
  authenticate(["admin"]),
  teacherControllers.updateTeacher
);
teacherRoutes.delete(
  "/delete-teacher/:teacherId",
  authenticate(["admin"]),
  teacherControllers.deleteTeacher
);
teacherRoutes.put(
  "/recover-teacher-by-id/:teacherId",
  authenticate(["admin"]),
  teacherControllers.recoverTeacher
);
teacherRoutes.get(
  "/get-all-teacher-codes",
  authenticate(["admin", "teacher"]),
  teacherControllers.getAllTeacherCodes
);

teacherRoutes.get(
  "/get-assigned-subjects/:teacherId",
  authenticate(["admin", "teacher"]),
  teacherControllers.getAssignedSubjects
);

teacherRoutes.get(
  "/get-students-for-teacher/:teacherId",
  authenticate(["admin", "teacher"]),
  teacherControllers.getStudentsForTeacher
);

export default teacherRoutes;
