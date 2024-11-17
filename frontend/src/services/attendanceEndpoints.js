import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/attendance`;

export const markAttendanceForASubject = async (subjectData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/create-attendance`,
      subjectData,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

export const updateAttendance = async (attendanceData, attendanceId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/update-subject-details-by-id/${attendanceData}`,
      attendanceData,
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

export const getAllAttendance = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/get-all-attendances`, {
      headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${token}`,
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all attendances:", error);
    throw error;
  }
};

export const getStudentAttendanceGroupedBySubject = async (studentId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/get-student-attendance-grouped-by-subject/${studentId}`,
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${token}`,
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error getting all attendances:", error);
    throw error;
  }
};
