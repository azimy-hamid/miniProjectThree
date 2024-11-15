import {
  createStudents,
  createTeachers,
  createSubjectsForGrades,
  createClassrooms,
  assignSubjectsToTeachers,
} from "./seedAllModelsScripts.js";

export async function populateDatabase() {
  try {
    console.log("Starting database population...");

    // Create classrooms
    await createClassrooms();
    console.log("Classrooms created.");

    // create subjects for each grade
    await createSubjectsForGrades();
    console.log("Subjects created for each grade.");

    // Create teachers
    await createTeachers();
    console.log("Teachers created.");

    // Create students
    await createStudents();
    console.log("Students created.");
    // assign subjects to teachers
    await assignSubjectsToTeachers();
    console.log("Assigned subjects to teachers.");

    console.log("Database population completed successfully.");
  } catch (error) {
    console.error("Error populating the database:", error);
  }
}
