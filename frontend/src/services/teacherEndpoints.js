import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/teacher`;

export const createTeacher = async (teacherData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/create-teacher`,
      teacherData,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error Creating Teacher:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export const getAllTeachers = async () => {
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

export const getTeacherById = async (teacherId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/get-specific-teacher/${teacherId}`,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting teacher by id:", error);
    throw error;
  }
};

export const updateTeacher = async (teacherId, teacherData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/update-teacher-details-by-id/${teacherId}`,
      teacherData,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error Updating Teacher:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export const getAllTeacherCodes = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-teacher-codes`, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all teacher codes:", error);
    throw error;
  }
};

export const getAssignedSubjects = async (teacherId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/get-assigned-subjects/${teacherId}`,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all teacher codes:", error);
    throw error;
  }
};

export const deleteTeacher = async (teacherId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${API_URL}/delete-teacher/${teacherId}`,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all teacher codes:", error);
    throw error;
  }
};
