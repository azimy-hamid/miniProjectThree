import { jest } from "@jest/globals";
import { createStudent } from "../controllers/studentsController.js"; // Adjust path as needed
import Students from "../models/Students.js";
import Semesters from "../models/Semesters.js";
import Grades from "../models/Grades.js";

jest.mock("../models/Students.js");
jest.mock("../models/Semesters.js");
jest.mock("../models/Grades.js");

describe("createStudent Controller", () => {
  const mockReq = {
    body: {
      student_first_name: "John",
      student_last_name: "Doe",
      gender: "male",
      dob: "2000-01-01",
      email: "johndoe@example.com",
      phone: "1234567890",
      join_date: "2024-01-01",
      semester_id_fk: "valid-semester-id",
      grade_id_fk: "valid-grade-id",
    },
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new student successfully", async () => {
    // Mock successful foreign key validations
    Semesters.findByPk.mockResolvedValue({ id: mockReq.body.semester_id_fk });
    Grades.findByPk.mockResolvedValue({ id: mockReq.body.grade_id_fk });

    // Mock successful student creation
    Students.create.mockResolvedValue({
      ...mockReq.body,
      student_code: "STU-1",
      student_id_pk: "new-student-id",
    });

    await createStudent(mockReq, mockRes);

    expect(Students.create).toHaveBeenCalledWith(
      expect.objectContaining({
        student_first_name: "John",
        student_last_name: "Doe",
        email: "johndoe@example.com",
        semester_id_fk: "valid-semester-id",
        grade_id_fk: "valid-grade-id",
      })
    );
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Student created successfully",
        student: expect.objectContaining({
          student_id_pk: "new-student-id",
          student_code: "STU-1",
        }),
      })
    );
  });

  it("should return 400 if semester is invalid", async () => {
    Semesters.findByPk.mockResolvedValue(null);

    await createStudent(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Invalid semester ID.",
      })
    );
  });

  it("should return 400 if grade is invalid", async () => {
    Semesters.findByPk.mockResolvedValue({ id: mockReq.body.semester_id_fk });
    Grades.findByPk.mockResolvedValue(null);

    await createStudent(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Invalid grade ID.",
      })
    );
  });

  it("should handle Sequelize validation errors", async () => {
    Semesters.findByPk.mockResolvedValue({ id: mockReq.body.semester_id_fk });
    Grades.findByPk.mockResolvedValue({ id: mockReq.body.grade_id_fk });

    const validationError = new Error("Validation error");
    validationError.name = "SequelizeValidationError";
    Students.create.mockRejectedValue(validationError);

    await createStudent(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Validation error",
      })
    );
  });

  it("should handle other errors", async () => {
    Semesters.findByPk.mockResolvedValue({ id: mockReq.body.semester_id_fk });
    Grades.findByPk.mockResolvedValue({ id: mockReq.body.grade_id_fk });

    Students.create.mockRejectedValue(new Error("Database error"));

    await createStudent(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "An error occurred while creating the student.",
      })
    );
  });
});
