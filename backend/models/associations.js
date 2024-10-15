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
import StudentGrades from "./StudentGrades.js";
import Subjects from "./Subjects.js";
import Teachers from "./Teachers.js";
import User_Role_Assignment from "./UserRoleAssignment.js";
import User_Roles from "./UserRoles.js";
import Student_Subjects from "./StudentSubjects.js";
import Teacher_Subjects from "./TeacherSubjects.js";
import Semester_Subject from "./SemesterSubject.js";
import Semesters from "./Semesters.js";

const setupAssociations = () => {
  // attendace and students and semester_subject

  try {
    Students.hasMany(Attendance, {
      foreignKey: "student_id_fk",
      as: "attendance",
    });
    Attendance.belongsTo(Students, {
      foreignKey: "student_id_fk",
      as: "student",
    });

    Semester_Subject.hasMany(Attendance, {
      foreignKey: "semester_subject_id_fk", // Corrected foreign key name
      as: "attendance",
    });

    Attendance.belongsTo(Semester_Subject, {
      foreignKey: "semester_subject_id_fk", // Corrected foreign key name
      as: "semester_subject",
    });

    // subjects and semester_subjects - semesters and semester_subjects
    // Semester_Subject belongs to a Semester
    Semester_Subject.belongsTo(Semesters, {
      foreignKey: "semester_id_fk",
      targetKey: "semester_id_pk",
    });

    // Semester_Subject belongs to a Subject
    Semester_Subject.belongsTo(Subjects, {
      foreignKey: "subject_id_fk",
      targetKey: "subject_id_pk",
    });

    // Semesters has many Semester_Subjects
    Semesters.hasMany(Semester_Subject, {
      foreignKey: "semester_id_fk",
      sourceKey: "semester_id_pk",
    });

    // Subjects has many Semester_Subjects
    Subjects.hasMany(Semester_Subject, {
      foreignKey: "subject_id_fk",
      sourceKey: "subject_id_pk",
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

    // Students - StudentGrades

    Students.hasMany(StudentGrades, {
      foreignKey: "student_id_fk",
      sourceKey: "student_id_pk", // Source key in Students
      as: "grades", // Alias for accessing related grades
    });

    StudentGrades.belongsTo(Students, {
      foreignKey: "student_id_fk",
      targetKey: "student_id_pk", // Target key in Students
      as: "student", // Alias for accessing the related student
    });

    // Students - Subjects - Teachers - Classrooms
    Classrooms.hasMany(Subjects, {
      foreignKey: "classroom_id_fk",
      as: "subjects",
    });
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
    });

    User_Roles.belongsToMany(Users, {
      through: User_Role_Assignment,
      foreignKey: "role_id_fk",
    });
  } catch (error) {
    console.log("Error setting up associations:", error);
  }
};

export { setupAssociations };
