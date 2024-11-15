import { Op } from "sequelize";
import bcrypt from "bcryptjs";

import User_Roles from "../models/UserRoles.js";
import User_Role_Assignment from "../models/UserRoleAssignment.js";
import Users from "../models/Users.js";
import Semesters from "../models/Semesters.js";
import Grades from "../models/Grades.js";
import Students from "../models/Students.js";
import Teachers from "../models/Teachers.js";
import Classrooms from "../models/Classrooms.js";
import Subjects from "../models/Subjects.js";
import ClassSchedule from "../models/ClassSchedule.js";
import Student_Subjects from "../models/StudentSubjects.js";
import Teacher_Subjects from "../models/TeacherSubjects.js";

export async function createStudents() {
  // Fetch semester IDs and grade IDs
  const { semester1Id, semester2Id } = await getSemesterIds();
  const gradeIds = await getGradeIds();

  // Get subjects grouped by grade
  const groupedSubjects = await getSubjectsIdsGroupedByGrade();
  console.info(groupedSubjects);

  // Define students with unique grade assignments
  const students = [
    {
      student_first_name: "Alice",
      student_last_name: "Smith",
      gender: "female",
      dob: new Date(2005, 5, 15),
      email: "alice.smith@example.com",
      phone: "123-456-7890",
      join_date: new Date(2022, 8, 1),
      semester_id_fk: semester1Id,
      grade_id_fk: gradeIds.grade1Id,
    },
    {
      student_first_name: "Bob",
      student_last_name: "Jones",
      gender: "male",
      dob: new Date(2004, 3, 20),
      email: "bob.jones@example.com",
      phone: "098-765-4321",
      join_date: new Date(2022, 8, 1),
      semester_id_fk: semester2Id,
      grade_id_fk: gradeIds.grade2Id,
    },
    {
      student_first_name: "Charlie",
      student_last_name: "Brown",
      gender: "male",
      dob: new Date(2003, 7, 10),
      email: "charlie.brown@example.com",
      phone: "111-222-3333",
      join_date: new Date(2022, 8, 1),
      semester_id_fk: semester1Id,
      grade_id_fk: gradeIds.grade3Id,
    },
    {
      student_first_name: "Daisy",
      student_last_name: "Miller",
      gender: "female",
      dob: new Date(2002, 1, 25),
      email: "daisy.miller@example.com",
      phone: "444-555-6666",
      join_date: new Date(2022, 8, 1),
      semester_id_fk: semester2Id,
      grade_id_fk: gradeIds.grade4Id,
    },
    {
      student_first_name: "Eve",
      student_last_name: "Taylor",
      gender: "female",
      dob: new Date(2001, 9, 5),
      email: "eve.taylor@example.com",
      phone: "777-888-9999",
      join_date: new Date(2022, 8, 1),
      semester_id_fk: semester1Id,
      grade_id_fk: gradeIds.grade5Id,
    },
    // Additional students
  ];

  // Add more students dynamically for grades 6 to 12
  for (let i = 6; i <= 12; i++) {
    students.push({
      student_first_name: `Student${i}`,
      student_last_name: `Lastname${i}`,
      gender: i % 2 === 0 ? "male" : "female",
      dob: new Date(2000 + (12 - i), 6, 15),
      email: `student${i}@example.com`,
      phone: `555-000-${1000 + i}`,
      join_date: new Date(2022, 8, 1),
      semester_id_fk: i % 2 === 0 ? semester2Id : semester1Id,
      grade_id_fk: gradeIds[`grade${i}Id`],
    });
  }

  // Fetch role IDs for student
  const roleIds = await getUserRoleIds();

  // Process each student individually
  for (const student of students) {
    try {
      // Create the student record in the Students table
      const createdStudent = await Students.create({
        ...student,
      });

      console.log(
        `Created student: ${createdStudent.student_first_name} ${createdStudent.student_last_name}`
      );

      // Hash the password for the student
      const hashedPassword = await bcrypt.hash(
        `defaultpassword${student.student_first_name.charAt(0)}`,
        10
      );

      // Create the user in the Users table
      const user = await Users.create({
        user_id_fk: createdStudent.student_id_pk, // Link to the student ID
        user_type: "student", // Set the user type to student
        email: createdStudent.email,
        username: createdStudent.email.split("@")[0], // Generate username from email
        password_hash: hashedPassword, // Use the hashed password
      });

      console.log(
        `Created user for student: ${createdStudent.student_first_name} ${createdStudent.student_last_name}`
      );

      // Assign the student role to the user in the User_Role_Assignment table
      await User_Role_Assignment.create({
        user_id_fk: user.user_id_pk,
        role_id_fk: roleIds.studentRoleId, // Assign the student role
      });

      // Get the grade_code of the student
      const grade = await Grades.findByPk(student.grade_id_fk);

      if (!grade) {
        throw new Error(
          `Grade with ID ${student.grade_id_fk} not found for student ${student.student_first_name} ${student.student_last_name}`
        );
      }

      // Retrieve the grade code
      const gradeCode = grade.grade_code;

      // Get the subject IDs associated with the student's grade_code
      const subjectIds = groupedSubjects[gradeCode];

      // Enroll the student in their subjects
      for (const subjectId of subjectIds) {
        await Student_Subjects.create({
          student_id_fk: createdStudent.student_id_pk, // Link to the student
          subject_id_fk: subjectId, // Link to the subject
        });
        console.log(
          `Enrolled student ${createdStudent.student_first_name} ${createdStudent.student_last_name} in subject with ID: ${subjectId}`
        );
      }
    } catch (error) {
      console.error(
        `Error creating student ${student.student_first_name}:`,
        error.message
      );
    }
  }

  console.log(
    "All students, their corresponding users, and subject enrollments have been created successfully."
  );
}

export async function createTeachers() {
  const gradeIds = await getGradeIds();

  // Get role IDs for teacher and other roles
  const roleIds = await getUserRoleIds();

  // Define teachers with initial data
  const teachers = [
    {
      teacher_first_name: "John",
      teacher_last_name: "Doe",
      gender: "male",
      dob: new Date(1985, 4, 10),
      email: "john.doe1@example.com",
      phone: "555-111-1111",
      join_date: new Date(2020, 1, 15),
      working_days: "monday, wednesday, friday",
      grade_id_fk: gradeIds.grade1Id,
    },
    {
      teacher_first_name: "Jane",
      teacher_last_name: "Smith",
      gender: "female",
      dob: new Date(1988, 2, 25),
      email: "jane.smith2@example.com",
      phone: "555-222-2222",
      join_date: new Date(2019, 3, 12),
      working_days: "tuesday, thursday",
      grade_id_fk: gradeIds.grade2Id,
    },
    // Add more static teachers here if needed
  ];

  // Add dynamically generated teachers up to grade 12
  for (let i = 3; i <= 12; i++) {
    teachers.push({
      teacher_first_name: `Teacher${i}`,
      teacher_last_name: `Lastname${i}`,
      gender: i % 2 === 0 ? "female" : "male",
      dob: new Date(1980 + i, 5, 10),
      email: `teacher${i}@example.com`,
      phone: `555-000-${1000 + i}`,
      join_date: new Date(2021, 8, 1),
      working_days: "monday, wednesday, friday",
      grade_id_fk: gradeIds[`grade${i}Id`],
    });
  }

  // Create each teacher one by one
  for (const teacherData of teachers) {
    try {
      // Create the teacher instance
      const teacher = await Teachers.create(teacherData);

      // Hash the password for the teacher
      const hashedPassword = await bcrypt.hash("Password123@", 10);

      // Create the corresponding user
      const user = await Users.create({
        user_id_fk: teacher.teacher_id_pk, // Link to teacher's primary key
        user_type: "teacher",
        email: teacher.email,
        username: teacher.email.split("@")[0],
        password_hash: hashedPassword,
      });

      // Assign the 'teacher' role to the user
      await User_Role_Assignment.create({
        user_id_fk: user.user_id_pk,
        role_id_fk: roleIds.teacherRoleId,
      });

      console.log(
        `Created teacher and user: ${teacher.teacher_first_name} ${teacher.teacher_last_name}`
      );
    } catch (error) {
      console.error(
        `Error creating teacher ${teacherData.teacher_first_name} ${teacherData.teacher_last_name}:`,
        error.message
      );
    }
  }

  console.log(
    "Teachers and their corresponding users have been created successfully."
  );
}

export async function createSubjectsForGrades() {
  try {
    // Fetch all grades from the Grades table
    const grades = await Grades.findAll();

    // Get classroom IDs via the getClassroomIds function
    const classroomIds = await getClassroomIds();

    // Ensure there are enough lecture halls to assign to each grade (12 lecture halls)
    if (classroomIds.lectureHalls.length < grades.length) {
      throw new Error("Not enough lecture halls available for all grades.");
    }

    // Define fixed start times and end times for the subjects
    const scheduleTimes = [
      { start: "08:00:00", end: "09:00:00" },
      { start: "09:30:00", end: "10:30:00" },
      { start: "11:00:00", end: "12:00:00" },
      { start: "12:30:00", end: "13:30:00" },
      { start: "14:00:00", end: "15:00:00" },
    ];

    // Loop through each grade and create subjects for it
    for (let i = 0; i < grades.length; i++) {
      const grade = grades[i];

      // Assign a unique lecture hall for each grade
      const assignedClassroomId = classroomIds.lectureHalls[i]; // Use a unique lecture hall for each grade

      // Create subjects one at a time for this grade
      for (let j = 1; j <= 5; j++) {
        const subject = await Subjects.create({
          subject_name: `Subject ${j} for ${grade.grade_code}`, // Dynamic subject name based on grade
          grade_id_fk: grade.grade_id_pk, // Reference to the grade
          semester_id_fk: null, // Optionally set a semester, if needed
          classroom_id_fk: assignedClassroomId, // Classroom ID assigned uniquely per grade
          section: `Section ${j}`, // Section name
        });

        console.log(
          `Created subject: ${subject.subject_name} for grade ${grade.grade_code}`
        );

        // Define fixed days for each subject (Monday to Friday)
        const daysOfWeek = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
        ];
        const dayOfWeek = daysOfWeek[j - 1]; // Assign one of the weekdays
        const { start, end } = scheduleTimes[j - 1]; // Use the corresponding time slot

        // Ensure no conflicts with the classroom schedule
        const conflictingSchedule = await ClassSchedule.findOne({
          where: {
            classroom_id_fk: subject.classroom_id_fk,
            day_of_week: dayOfWeek,
            start_time: {
              [Op.lte]: end,
            },
            end_time: {
              [Op.gte]: start,
            },
          },
        });

        if (conflictingSchedule) {
          throw new Error("Schedule conflict detected. Please try again.");
        }

        // Create the class schedule for the subject
        await ClassSchedule.create({
          subject_id_fk: subject.subject_id_pk, // Link to the subject
          classroom_id_fk: subject.classroom_id_fk, // Same classroom as the subject
          day_of_week: dayOfWeek,
          start_time: start,
          end_time: end,
        });

        console.log(
          `Scheduled subject: ${subject.subject_name} on ${dayOfWeek} from ${start} to ${end}`
        );
      }
    }

    console.log(
      "Subjects and class schedules created successfully for each grade."
    );
  } catch (error) {
    console.error("Error creating subjects and class schedules:", error);
  }
}

export async function createClassrooms() {
  // Create 12 lecture halls individually
  for (let i = 1; i <= 12; i++) {
    await Classrooms.create({
      capacity: 100, // Assuming capacity, can be customized as needed
      room_type: "lecture hall",
      description: `Lecture Hall ${i}`,
    });
    console.log(`Created: Lecture Hall ${i}`);
  }

  // Create remaining room types individually
  const roomTypes = [
    { room_type: "laboratory", capacity: 30, description: "Laboratory" },
    { room_type: "computer lab", capacity: 25, description: "Computer Lab" },
    { room_type: "library", capacity: 50, description: "Library" },
    { room_type: "art room", capacity: 20, description: "Art Room" },
    { room_type: "music room", capacity: 20, description: "Music Room" },
    { room_type: "study hall", capacity: 40, description: "Study Hall" },
  ];

  for (const room of roomTypes) {
    await Classrooms.create({
      capacity: room.capacity,
      room_type: room.room_type,
      description: room.description,
    });
    console.log(`Created: ${room.description}`);
  }

  console.log("All classrooms created successfully.");
}

async function getUserRoleIds() {
  const roles = await Promise.all([
    User_Roles.findOne({ where: { role_name: "student" } }),
    User_Roles.findOne({ where: { role_name: "teacher" } }),
    User_Roles.findOne({ where: { role_name: "admin" } }),
    User_Roles.findOne({ where: { role_name: "super" } }),
  ]);

  return {
    studentRoleId: roles[0] ? roles[0].role_id_pk : null,
    teacherRoleId: roles[1] ? roles[1].role_id_pk : null,
    adminRoleId: roles[2] ? roles[2].role_id_pk : null,
    superRoleId: roles[3] ? roles[3].role_id_pk : null,
  };
}

export async function assignSubjectsToTeachers() {
  try {
    // Fetch the subjects grouped by grade
    const subjectsGroupedByGrade = await getSubjectsIdsGroupedByGrade();

    // Loop through each grade's subjects
    for (const gradeCode in subjectsGroupedByGrade) {
      const subjects = subjectsGroupedByGrade[gradeCode];

      // First, find the grade by its grade_code
      const grade = await Grades.findOne({
        where: { grade_code: gradeCode }, // Get grade by grade_code
      });

      if (!grade) {
        console.log(`Grade ${gradeCode} not found.`);
        continue; // Skip if grade is not found
      }

      // Now, find the teacher who is assigned to that grade
      const teacher = await Teachers.findOne({
        where: { grade_id_fk: grade.grade_id_pk }, // Find teacher based on grade_id_pk
      });

      if (!teacher) {
        console.log(`Teacher for grade ${gradeCode} not found.`);
        continue; // Skip if teacher is not found
      }

      // For each subject in this grade, assign the teacher
      for (const subjectId of subjects) {
        await Teacher_Subjects.create({
          teacher_id_fk: teacher.teacher_id_pk, // Teacher's ID
          subject_id_fk: subjectId, // Subject's ID
        });
      }

      console.log(
        `Assigned subjects for grade ${gradeCode} to teacher ${teacher.teacher_first_name} ${teacher.teacher_last_name}.`
      );
    }
  } catch (error) {
    console.error("Error assigning subjects to teachers:", error);
  }
}

async function getSemesterIds() {
  const semester1 = await Semesters.findOne({ where: { semester_number: 1 } });
  const semester2 = await Semesters.findOne({ where: { semester_number: 2 } });

  return {
    semester1Id: semester1 ? semester1.semester_id_pk : null,
    semester2Id: semester2 ? semester2.semester_id_pk : null,
  };
}

async function getGradeIds() {
  const gradeIds = {};

  // Loop through each grade level from 1 to 12 and get the corresponding grade_id_pk
  for (let gradeLevel = 1; gradeLevel <= 12; gradeLevel++) {
    const grade = await Grades.findOne({ where: { grade_level: gradeLevel } });
    if (grade) {
      gradeIds[`grade${gradeLevel}Id`] = grade.grade_id_pk;
    } else {
      gradeIds[`grade${gradeLevel}Id`] = null; // If grade not found, set null
    }
  }

  return gradeIds;
}

async function getClassroomIds() {
  // Fetch classroom IDs for lecture halls (assuming there are 12 lecture halls)
  const lectureHalls = await Classrooms.findAll({
    where: { room_type: "lecture hall" },
    order: [["classroom_code", "ASC"]],
    limit: 12,
  });

  // Fetch one classroom for each of the other room types
  const otherClassrooms = await Promise.all([
    Classrooms.findOne({ where: { room_type: "laboratory" } }),
    Classrooms.findOne({ where: { room_type: "computer lab" } }),
    Classrooms.findOne({ where: { room_type: "library" } }),
    Classrooms.findOne({ where: { room_type: "art room" } }),
    Classrooms.findOne({ where: { room_type: "music room" } }),
    Classrooms.findOne({ where: { room_type: "study hall" } }),
  ]);

  // Structure the IDs into an object for easier access
  const classroomIds = {
    lectureHalls: lectureHalls.map((hall) => hall.classroom_id_pk), // Array of 12 lecture hall IDs
    laboratoryId: otherClassrooms[0]
      ? otherClassrooms[0].classroom_id_pk
      : null,
    computerLabId: otherClassrooms[1]
      ? otherClassrooms[1].classroom_id_pk
      : null,
    libraryId: otherClassrooms[2] ? otherClassrooms[2].classroom_id_pk : null,
    artRoomId: otherClassrooms[3] ? otherClassrooms[3].classroom_id_pk : null,
    musicRoomId: otherClassrooms[4] ? otherClassrooms[4].classroom_id_pk : null,
    studyHallId: otherClassrooms[5] ? otherClassrooms[5].classroom_id_pk : null,
  };

  return classroomIds;
}

export async function getSubjectsIdsGroupedByGrade() {
  try {
    // Fetch all subjects with their associated grade_id_fk
    const subjects = await Subjects.findAll({
      attributes: ["subject_id_pk", "grade_id_fk"], // Only select subject_id and grade_id_fk
      include: [
        {
          model: Grades,
          attributes: ["grade_code"], // Include grade_code for grouping
        },
      ],
    });

    // Initialize an object to store the grouped subjects
    const groupedSubjects = {};

    // Loop through the subjects and group them by grade_code
    subjects.forEach((subject) => {
      const gradeCode = subject.Grade.grade_code; // Get the grade code from the associated grade model

      // If this grade doesn't exist in the groupedSubjects object, initialize it
      if (!groupedSubjects[gradeCode]) {
        groupedSubjects[gradeCode] = [];
      }

      // Add the subject ID to the respective grade group
      groupedSubjects[gradeCode].push(subject.subject_id_pk);
    });

    return groupedSubjects;
  } catch (error) {
    console.error("Error fetching subjects grouped by grade:", error);
    throw error; // Optionally, throw the error to handle it elsewhere
  }
}
