import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/subject`;

export const createSubject = async (subjectData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/create-subject`,
      subjectData,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error Creating Subject:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export const updateSubject = async (subjectData, subjectId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/update-subject-details-by-id/${subjectId}`,
      subjectData,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error updating Subject:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export const getAllSubject = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-subjects`, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all subjects:", error);
    throw error;
  }
};

export const getAllSubjectCodes = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-subject-codes`, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all subject codes:", error);
    throw error;
  }
};

export const getSpecificSubject = async (subjectId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/get-specific-subject/${subjectId}`,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting specific subject deep details:", error);
    throw error;
  }
};

export const getOnlyOneSubjectDetails = async (subjectId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/get-only-one-subject-details/${subjectId}`,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting one subject details:", error);
    throw error;
  }
};

export const getStudentsForSubject = async (subjectId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/get-students-for-subject/${subjectId}`,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting one subject details:", error);
    throw error;
  }
};

export const getSubjectsForStudent = async (studentId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/get-subjects-for-student/${studentId}`,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting one subject details:", error);
    throw error;
  }
};
