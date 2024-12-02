import express from "express";
import * as classroomControllers from "../../controllers/classroomControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const classroomRoutes = express.Router();

classroomRoutes.post(
  "/create-classroom",
  authenticate(["admin"]),
  classroomControllers.createClassroom
);
classroomRoutes.get(
  "/get-all-classrooms",
  authenticate(["admin"]),
  classroomControllers.getAllClassrooms
);
classroomRoutes.get(
  "/get-specific-classroom/:classroomId",
  authenticate(["admin"]),
  classroomControllers.getClassroomById
);
classroomRoutes.put(
  "/update-classroom-details-by-id/:classroomId",
  authenticate(["admin"]),
  classroomControllers.updateClassroom
);
classroomRoutes.delete(
  "/delete-classroom/:classroomId",
  authenticate(["admin"]),
  classroomControllers.deleteClassroom
);
classroomRoutes.put(
  "/recover-classroom-by-id/:classroomId",
  authenticate(["admin"]),
  classroomControllers.recoverClassroom
);

classroomRoutes.get(
  "/get-all-classroom-codes",
  authenticate(["admin"]),
  classroomControllers.getAllClassroomCodes
);

classroomRoutes.get(
  "/get-classroom-schedule/:classroomId",
  authenticate(["admin"]),
  classroomControllers.getClassroomSchedule
);

export default classroomRoutes;
