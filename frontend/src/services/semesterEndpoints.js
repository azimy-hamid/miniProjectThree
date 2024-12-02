import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/semester`;

export const createSemester = async (semesterDate) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/create-semester`,
      semesterDate,
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

export const getAllSemesters = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-semesters`, {
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

export const getAllSemestersNumbers = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-semester-numbers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all semester numbers:", error);
    throw error;
  }
};
