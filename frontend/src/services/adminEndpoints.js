import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/admin`;

const createAdmin = async (userData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/create-admin`, userData, {
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

export { createAdmin };
