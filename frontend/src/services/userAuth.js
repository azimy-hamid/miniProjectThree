import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/user`;

// Function to get the authorization token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Signup User Service
const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup-user`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error.response?.data || error.message;
  }
};

// Login User Service
const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login-user`, credentials, {
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error.response?.data || error.message;
  }
};

// Logout User Service
const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

// Update User Profile Service
const updateUserProfile = async (updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/update-user`, updatedData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update Profile Error:", error);
    throw error.response?.data || error.message;
  }
};

const checkUserExists = async (username, email) => {
  try {
    const response = await axios.get(
      `${API_URL}/check-user-exists/${email}/${username}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // This should return an object indicating the existence of the username and email
  } catch (error) {
    console.error("Check User Exists Error:", error);
    throw error.response?.data || error.message;
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  checkUserExists,
};
