import express from "express";
import * as classroomControllers from "../../controllers/classroomControllers.js";

const classroomRoutes = express.Router();

classroomRoutes.post("/create-classroom", classroomControllers.createClassroom);
classroomRoutes.get(
  "/get-all-classrooms",
  classroomControllers.getAllClassrooms
);
classroomRoutes.get(
  "/get-specific-classroom/:classroomId",
  classroomControllers.getClassroomById
);
classroomRoutes.put(
  "/update-classroom-details-by-id/:classroomId",
  classroomControllers.updateClassroom
);
classroomRoutes.delete(
  "/delete-classroom/:classroomId",
  classroomControllers.deleteClassroom
);
classroomRoutes.put(
  "/recover-classroom-by-id/:classroomId",
  classroomControllers.recoverClassroom
);

export default classroomRoutes;
