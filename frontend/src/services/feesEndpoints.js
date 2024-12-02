import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/fees`;

export const payFee = async (feeData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/create-fee`, feeData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error paying student fee:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export const updateFee = async (feeData, feeId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/update-student-details-by-id/${feeId}`,
      feeData,
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
    console.error("Error updating student fee:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export const getAllFees = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-fees`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all fees:", error);
    throw error;
  }
};
