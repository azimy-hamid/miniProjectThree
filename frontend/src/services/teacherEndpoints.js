import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/teacher`;

const createTeacher = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/create-teacher`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;
    if (data.token) {
      localStorage.setItem("token", data.token); // Save token to localStorage
    }
    if (data.role) {
      localStorage.setItem("role", data.role); // Save role to localStorage
    }

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export { createTeacher };
