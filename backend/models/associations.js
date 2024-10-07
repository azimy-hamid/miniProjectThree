import Students from "./Students.js";
import Users from "./Users.js";
import Events from "./Events.js";

import Attendance from "./Attendance.js";
import Classrooms from "./Classrooms.js";
import Classroom_Student from "./ClassroomStudent.js";
import ClassSchedule from "./ClassSchedule.js";
import Complaints from "./Complaints.js";
import Counseling_Appointments from "./CounselingAppointments.js";
import Event_Registration from "./EventRegistration.js";
import Fees from "./Fees.js";
import Marks from "./Marks.js";
import Notifications from "./Notifications.js";
import StudentDocuments from "./StudentDocument.js";
import StudentGrades from "./studentGrades.js";
import Subjects from "./Subjects.js";
import Teachers from "./Teachers.js";
import User_Role_Assignment from "./UserRoleAssignment.js";
import User_Roles from "./UserRoles.js";

const setupAssociations = () => {
  // attendace and students

  Students.hasMany(Attendance, {
    foreignKey: "student_id_fk",
    as: "attendance",
  });
  Attendance.belongsTo(Students, {
    foreignKey: "student_id_fk",
    as: "student",
  });

  Subjects.hasMany(Attendance, {
    foreignKey: "subject_id_fk",
    as: "attendance",
  });
  Attendance.belongsTo(Subjects, {
    foreignKey: "subject_id_fk",
    as: "subject",
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

  Students.associate = () => {
    Students.hasMany(StudentDocuments, {
      foreignKey: "student_id_fk",
      as: "documents",
    });
  };

  Complaints.associate = () => {
    Complaints.belongsTo(Students, {
      foreignKey: "student_id_fk", // Foreign key in Complaints
      targetKey: "student_id_pk", // Target key in Students
      as: "student", // Alias for accessing the related student
    });
  };

  // students - Counseling_Appointments - Teachers
  Students.hasMany(Counseling_Appointments, {
    foreignKey: "student_id_fk",
    as: "counseling_appointments",
  });
  Counseling_Appointments.belongsTo(Students, {
    foreignKey: "student_id_fk",
    as: "student",
  });

  Teachers.hasMany(Counseling_Appointments, {
    foreignKey: "teacher_id_fk",
    as: "counseling_sessions",
  });
  Counseling_Appointments.belongsTo(Teachers, {
    foreignKey: "teacher_id_fk",
    as: "counselor",
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

  // Students - StudentDocuments
  Students.hasMany(StudentDocuments, {
    foreignKey: "student_id_fk",
    as: "documents",
  });

  StudentDocuments.belongsTo(Students, {
    foreignKey: "student_id_fk",
    as: "student",
  });

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
  Students.hasMany(Subjects, { foreignKey: "student_id_fk", as: "subjects" });
  Subjects.belongsTo(Students, { foreignKey: "student_id_fk", as: "student" });

  Teachers.hasMany(Subjects, { foreignKey: "teacher_id_fk", as: "subjects" });
  Subjects.belongsTo(Teachers, { foreignKey: "teacher_id_fk", as: "teacher" });

  Classrooms.hasMany(Subjects, {
    foreignKey: "classroom_id_fk",
    as: "subjects",
  });
  Subjects.belongsTo(Classrooms, {
    foreignKey: "classroom_id_fk",
    as: "classroom",
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
};

export { setupAssociations };
