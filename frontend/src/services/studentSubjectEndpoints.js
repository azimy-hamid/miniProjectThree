import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/student-subject`;

export const assignSubject = async (studentSubjectData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/create-student-subject`,
      studentSubjectData,
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
    console.error("Error assigning subject:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
};

// export const updateStudent = async (studentData, studentId) => {
//   try {
//     const token = localStorage.getItem("token");

//     const response = await axios.put(
//       `${API_URL}/update-student-details-by-id/${studentId}`,
//       studentData,
//       {
//         headers: { "Content-Type": "application/json" },
//         Authorization: `Bearer ${token}`,
//       }
//     );

//     const data = response.data;

//     return data;
//   } catch (error) {
//     console.error("Error Creating Student:", error);
//     throw error; // Propagate the error to handle it where the function is called
//   }
// };
