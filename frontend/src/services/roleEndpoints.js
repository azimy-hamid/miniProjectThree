import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/role`;

// Function to get the authorization token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Create a new user role
const createRole = async (roleData) => {
  try {
    const token = getAuthToken();

    const response = await axios.post(`${API_URL}/create-role`, roleData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Create Role Error:", error);
    throw error.response?.data || error.message;
  }
};

// Get all user roles
const getAllRoles = async () => {
  try {
    const token = getAuthToken();

    const response = await axios.get(`${API_URL}/get-all-roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get All Roles Error:", error);
    throw error.response?.data || error.message;
  }
};

// Get a single user role by ID
const getRoleById = async (roleID) => {
  try {
    const token = getAuthToken();

    const response = await axios.get(`${API_URL}/get-role-by-id/${roleID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get Role by ID Error:", error);
    throw error.response?.data || error.message;
  }
};

// Get a single user role by name
const getRoleByName = async (name) => {
  try {
    const token = getAuthToken();

    const response = await axios.get(`${API_URL}/get-role-by-name/${name}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a user role by ID
const updateRole = async (roleID, updatedData) => {
  try {
    const token = getAuthToken();

    const response = await axios.put(
      `${API_URL}/update/${roleID}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update Role Error:", error);
    throw error.response?.data || error.message;
  }
};

// Delete a user role by ID (soft delete)
const deleteRole = async (roleID) => {
  try {
    const token = getAuthToken();

    const response = await axios.delete(`${API_URL}/delete/${roleID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Delete Role Error:", error);
    throw error.response?.data || error.message;
  }
};

export {
  createRole,
  getAllRoles,
  getRoleById,
  getRoleByName,
  updateRole,
  deleteRole,
};
