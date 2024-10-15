import express, { response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes/teacherRoutes.js";
import classroomRoutes from "./routes/classroomRoutes/classroomRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes/feedbackRoutes.js";
import marksRoutes from "./routes/marksRoutes/marksRoutes.js";
import classScheduleRoutes from "./routes/classScheduleRoutes/classScheduleRoutes.js";
import feeRoutes from "./routes/feeRoutes/feeRoutes.js";
import studentGradeRoutes from "./routes/studentGradeRoutes/studentGradeRoutes.js";
import subjectRoutes from "./routes/subjectRoutes/subjectRoutes.js";
import semesterRoutes from "./routes/semesterRoutes/semesterRoutes.js";
import studentSubjectRoutes from "./routes/studentSubjectRoutes/studentSubjectRoutes.js";
import teacherSubjectRoutes from "./routes/teacherSubjectRoutes/teacherSubjectRoutes.js";

import authenticate from "./middlewares/authenticate.js";

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

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/classroom", classroomRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/mark", marksRoutes);
app.use("/class-schedule", classScheduleRoutes);
app.use("/fees", feeRoutes);
app.use("/student-grade", studentGradeRoutes);
app.use("/subject", subjectRoutes);
app.use("/semester", semesterRoutes);
app.use("/student-subject", studentSubjectRoutes);
app.use("/teacher-subject", teacherSubjectRoutes);

export default app;
