import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/student`;

export const createStudent = async (studentData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/create-student`,
      studentData,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error Creating Student:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export const updateStudent = async (studentData, studentId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/update-student-details-by-id/${studentId}`,
      studentData,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error Creating Student:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export const getAllStudents = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-students`, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all students:", error);
    throw error;
  }
};

export const getSpecificStudent = async (studentId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/get-specific-student/${studentId}`,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting specific student:", error);
    throw error;
  }
};

export const getStudentSubjects = async (studentId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/get-student-subjects/${studentId}`,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = await response.data;

    return data;
  } catch (error) {
    console.error("Error getting subjects for the student:", error);
    throw error;
  }
};

export const getNumberOfStudents = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-number-of-students`, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = await response.data;

    return data;
  } catch (error) {
    console.error("Error getting subjects for the student:", error);
    throw error;
  }
};

export const getAllStudentCodes = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-student-codes`, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = await response.data;

    return data;
  } catch (error) {
    console.error("Error getting all the student codes:", error);
    throw error;
  }
};
