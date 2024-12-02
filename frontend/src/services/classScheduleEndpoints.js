import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/class-schedule`;

export const createClassSchedule = async (classScheduleData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/create-class-schedule`,
      classScheduleData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error Creating Semester:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export const getAllGrades = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-class-schedules`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all semesters:", error);
    throw error;
  }
};
