import sequelize from "../config/dbConfig.js";

import Students from "./Students.js";
import Users from "./Users.js";
import Events from "./Events.js";

import Attendance from "./Attendance.js";
import Classrooms from "./Classrooms.js";
import Classroom_Student from "./ClassroomStudent.js";
import ClassSchedule from "./ClassSchedule.js";
import Feedbacks from "./Feedbacks.js";
import Event_Registration from "./EventRegistration.js";
import Fees from "./Fees.js";
import Marks from "./Marks.js";
import Notifications from "./Notifications.js";
import Grades from "./Grades.js";
import Subjects from "./Subjects.js";
import Teachers from "./Teachers.js";
import User_Role_Assignment from "./UserRoleAssignment.js";
import User_Roles from "./UserRoles.js";
import Student_Subjects from "./StudentSubjects.js";
import Teacher_Subjects from "./TeacherSubjects.js";
import Semesters from "./Semesters.js";

const setupAssociations = () => {
  // attendace and students

  try {
    Students.hasMany(Attendance, {
      foreignKey: "student_id_fk",
      as: "attendance",
    });
    Attendance.belongsTo(Students, {
      foreignKey: "student_id_fk",
      as: "student",
    });

    // classrooms and students
    Classrooms.belongsToMany(Students, {
      through: Classroom_Student,
      foreignKey: "classroom_id_fk",
      as: "students",
    });
    Students.belongsToMany(Classrooms, {
      through: Classroom_Student,
      foreignKey: "student_id_fk",
      as: "classrooms",
    });

    // students and semesters:
    Students.belongsTo(Semesters, {
      foreignKey: "semester_id_fk",
      targetKey: "semester_id_pk",
    });

    // subjects and semesters:

    Subjects.belongsTo(Semesters, {
      foreignKey: "semester_id_fk",
      targetKey: "semester_id_pk",
    });
    // subjects and grades:

    Subjects.belongsTo(Grades, {
      foreignKey: "grade_id_fk",
      targetKey: "grade_id_pk",
    });

    // subjects - class schedual - classrooms

    Subjects.hasMany(ClassSchedule, {
      foreignKey: "subject_id_fk",
      as: "schedules",
    });
    ClassSchedule.belongsTo(Subjects, {
      foreignKey: "subject_id_fk",
      as: "subject",
    });

    Classrooms.hasMany(ClassSchedule, {
      foreignKey: "classroom_id_fk",
      as: "schedules",
    });
    ClassSchedule.belongsTo(Classrooms, {
      foreignKey: "classroom_id_fk",
      as: "classroom",
    });
    // students - complaints

    Feedbacks.belongsTo(Students, {
      foreignKey: "student_id_fk", // Foreign key in Complaints
      targetKey: "student_id_pk", // Target key in Students
      as: "student", // Alias for accessing the related student
    });

    // Events - Event_Registration - Students
    Events.hasMany(Event_Registration, {
      foreignKey: "event_id_fk",
      as: "registrations",
    });
    Event_Registration.belongsTo(Events, {
      foreignKey: "event_id_fk",
      as: "event",
    });

    Students.hasMany(Event_Registration, {
      foreignKey: "student_id_fk",
      as: "event_registrations",
    });
    Event_Registration.belongsTo(Students, {
      foreignKey: "student_id_fk",
      as: "student",
    });

    // students - fees
    Students.hasMany(Fees, { foreignKey: "student_id_fk", as: "fees" });
    Fees.belongsTo(Students, { foreignKey: "student_id_fk", as: "student" });

    // students - Marks
    Students.hasMany(Marks, { foreignKey: "student_id_fk", as: "marks" });
    Marks.belongsTo(Students, { foreignKey: "student_id_fk", as: "student" });

    Subjects.hasMany(Marks, { foreignKey: "subject_id_fk", as: "marks" });
    Marks.belongsTo(Subjects, { foreignKey: "subject_id_fk", as: "subject" });

    // Students - Grades

    Students.belongsTo(Grades, {
      foreignKey: "grade_id_fk",
      targetKey: "grade_id_pk",
    });

    // Students - Subjects - Teachers - Classrooms
    Subjects.belongsTo(Classrooms, {
      foreignKey: "classroom_id_fk",
      as: "classroom",
    });

    // student - subject - throught student_subject
    Students.belongsToMany(Subjects, {
      through: Student_Subjects, // This indicates the junction table
      foreignKey: "student_id_fk",
      as: "subjects", // Alias for inclusion
    });

    Subjects.belongsToMany(Students, {
      through: Student_Subjects, // This indicates the junction table
      foreignKey: "subject_id_fk",
      as: "students", // Alias for inclusion
    });

    // teacher - subject - throught student_subject
    Teachers.belongsToMany(Subjects, {
      through: Teacher_Subjects,
      foreignKey: "teacher_id_fk",
    });
    Subjects.belongsToMany(Teachers, {
      through: Teacher_Subjects,
      foreignKey: "subject_id_fk",
    });

    // Users - User_Roles
    Users.belongsToMany(User_Roles, {
      through: User_Role_Assignment,
      foreignKey: "user_id_fk",
      as: "roles", // This allows you to access user roles via users.getRoles() in Sequelize
    });

    User_Roles.belongsToMany(Users, {
      through: User_Role_Assignment,
      foreignKey: "role_id_fk",
      as: "users", // This allows you to access users via roles.getUsers() in Sequelize
    });
  } catch (error) {
    console.log("Error setting up associations:", error);
  }
};

export { setupAssociations };
