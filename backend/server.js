import app from "./app.js";
import dotenv from "dotenv";
import sequelize from "./config/dbConfig.js";

import Students from "./models/Students.js";
import Users from "./models/Users.js";
import Events from "./models/Events.js";

import Attendance from "./models/Attendance.js";
import Classrooms from "./models/Classrooms.js";
import Classroom_Student from "./models/ClassroomStudent.js";
import ClassSchedule from "./models/ClassSchedule.js";
import Complaints from "./models/Complaints.js";
import Counseling_Appointments from "./models/CounselingAppointments.js";
import Event_Registration from "./models/EventRegistration.js";
import Fees from "./models/Fees.js";
import Marks from "./models/Marks.js";
import Notifications from "./models/Notifications.js";
import StudentDocuments from "./models/StudentDocument.js";
import StudentGrades from "./models/studentGrades.js";
import Subjects from "./models/Subjects.js";
import Teachers from "./models/Teachers.js";
import User_Role_Assignment from "./models/UserRoleAssignment.js";
import User_Roles from "./models/UserRoles.js";

import { setupAssociations } from "./models/associations.js";

dotenv.config();

setupAssociations();

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // You can use { force: true } during development to reset the tables { alter: true } to alter
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error creating database & tables:", error);
  }
};

const startServer = async () => {
  await syncDatabase();

  app.listen(process.env.PORT_NUMBER, () => {
    console.log(
      `Mini Project Three Backend Server running on port: ${process.env.PORT_NUMBER}`
    );
  });
};

startServer();
