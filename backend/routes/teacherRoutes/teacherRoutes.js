import express from "express";
import * as teacherControllers from "../../controllers/teacherControllers.js";

const teacherRoutes = express.Router();

teacherRoutes.post("/create-teacher", teacherControllers.createTeacher);
teacherRoutes.get("/get-all-teachers", teacherControllers.getAllTeachers);
teacherRoutes.get(
  "/get-specific-teacher/:teacherId",
  teacherControllers.getTeacherById
);
teacherRoutes.put(
  "/update-teacher-details-by-id/:teacherId",
  teacherControllers.updateTeacher
);
teacherRoutes.delete(
  "/delete-teacher/:teacherId",
  teacherControllers.deleteTeacher
);
teacherRoutes.put(
  "/recover-teacher-by-id/:teacherId",
  teacherControllers.recoverTeacher
);
teacherRoutes.get(
  "/get-all-teacher-codes",
  teacherControllers.getAllTeacherCodes
);

teacherRoutes.get(
  "/get-assigned-subjects/:teacherId",
  teacherControllers.getAssignedSubjects
);

teacherRoutes.get(
  "/get-students-for-teacher/:teacherId",
  teacherControllers.getStudentsForTeacher
);

export default teacherRoutes;
