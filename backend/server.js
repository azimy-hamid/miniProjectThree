import app from "./app.js";
import dotenv from "dotenv";
import sequelize from "./config/dbConfig.js";

import Students from "./models/Students.js";
import Users from "./models/Users.js";
import Events from "./models/Events.js";

import Admins from "./models/Admins.js";
import Attendance from "./models/Attendance.js";
import Classrooms from "./models/Classrooms.js";
import Classroom_Student from "./models/ClassroomStudent.js";
import ClassSchedule from "./models/ClassSchedule.js";
import Feedbacks from "./models/Feedbacks.js";
import Event_Registration from "./models/EventRegistration.js";
import Fees from "./models/Fees.js";
import Marks from "./models/Marks.js";
import Notifications from "./models/Notifications.js";
import Grades from "./models/Grades.js";
import Subjects from "./models/Subjects.js";
import Teachers from "./models/Teachers.js";
import User_Role_Assignment from "./models/UserRoleAssignment.js";
import User_Roles from "./models/UserRoles.js";
import Student_Subjects from "./models/StudentSubjects.js";
import Teacher_Subjects from "./models/TeacherSubjects.js";
import Semesters from "./models/Semesters.js";

import { setupAssociations } from "./models/associations.js";

import seedSuper from "./seedData/seedSuper.js";

dotenv.config();

setupAssociations();

const syncDatabase = async () => {
  try {
    await sequelize.sync(); // You can use { force: true } during development to reset the tables { alter: true } to alter
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error creating database & tables:", error);
  }
};

const startServer = async () => {
  await syncDatabase();

  await seedSuper();

  app.listen(process.env.PORT_NUMBER, () => {
    console.log(
      `Mini Project Three Backend Server running on port: ${process.env.PORT_NUMBER}`
    );
  });
};

startServer();
