import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/teacher`;

const createTeacher = async (userData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/create-teacher`, userData, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

const getAllTeachers = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-teachers`, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all teachers:", error);
    throw error;
  }
};

export { createTeacher, getAllTeachers };
