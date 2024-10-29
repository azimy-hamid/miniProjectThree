import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/student`;

const createStudent = async (studentData) => {
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

const getAllStudents = async () => {
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

export { createStudent, getAllStudents };
