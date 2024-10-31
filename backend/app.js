import express, { response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes/userRoutes.js";
import roleRoutes from "./routes/userRoleRoutes/userRoleRoutes.js";
import adminRoutes from "./routes/adminRoutes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes/teacherRoutes.js";
import classroomRoutes from "./routes/classroomRoutes/classroomRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes/feedbackRoutes.js";
import marksRoutes from "./routes/marksRoutes/marksRoutes.js";
import classScheduleRoutes from "./routes/classScheduleRoutes/classScheduleRoutes.js";
import feeRoutes from "./routes/feeRoutes/feeRoutes.js";
import gradeRoutes from "./routes/studentGradeRoutes/gradeRoutes.js";
import subjectRoutes from "./routes/subjectRoutes/subjectRoutes.js";
import semesterRoutes from "./routes/semesterRoutes/semesterRoutes.js";
import studentSubjectRoutes from "./routes/studentSubjectRoutes/studentSubjectRoutes.js";
import teacherSubjectRoutes from "./routes/teacherSubjectRoutes/teacherSubjectRoutes.js";
import eventRoutes from "./routes/eventRoutes/eventRoutes.js";
import eventRegistrationRoutes from "./routes/eventRegistrationRoutes/eventRegistrationRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes/attendanceRoutes.js";

import authenticate from "./middlewares/authenticate.js";
import Students from "./models/Students.js";

import { verifyToken } from "./utils/verifyToken.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", authenticate(["admin"]), async (req, res) => {
  try {
    res.status(200).json({
      response: "This is the root end point for 3rd mini project app",
    });
  } catch (error) {
    res.status(500).json({ rootEndpointError: error });
  }
});

app.post("/authanticate/verifyToken", verifyToken);

app.use("/user", userRoutes);
app.use("/role", roleRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/classroom", classroomRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/mark", marksRoutes);
app.use("/class-schedule", classScheduleRoutes);
app.use("/fees", feeRoutes);
app.use("/grade", gradeRoutes);
app.use("/subject", subjectRoutes);
app.use("/semester", semesterRoutes);
app.use("/student-subject", studentSubjectRoutes);
app.use("/teacher-subject", teacherSubjectRoutes);
app.use("/event", eventRoutes);
app.use("/event-registration", eventRegistrationRoutes);
app.use("/attendance", attendanceRoutes);

export default app;
