import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/classroom`;

export const createClassroom = async (classroomData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/create-classroom`,
      classroomData,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error Creating Classroom:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export const getAllClassroom = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-classrooms`, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all classrooms:", error);
    throw error;
  }
};

export const getAllClassroomCodes = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-classroom-codes`, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all classrooms:", error);
    throw error;
  }
};