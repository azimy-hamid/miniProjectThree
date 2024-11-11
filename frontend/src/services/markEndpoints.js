import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/mark`;

export const createMark = async (markData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/create-mark`, markData, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error Marking student subject:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};
