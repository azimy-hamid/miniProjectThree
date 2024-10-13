import express, { response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes/teacherRoutes.js";
import classroomRoutes from "./routes/classroomRoutes/classroomRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes/feedbackRoutes.js";

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

export default app;
