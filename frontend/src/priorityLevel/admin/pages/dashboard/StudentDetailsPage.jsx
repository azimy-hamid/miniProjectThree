import React, { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "./components/Header";
import { alpha } from "@mui/material/styles";
import { useParams } from "react-router-dom"; // Import useParams
import Grid from "@mui/material/Grid"; // Import Grid component
import { getSpecificStudent } from "../../../../services/studentEndpoints.js";
import StudentDetailsCard from "./components/StudentDetailsCard.jsx";
import UpdateStudentForm from "./components/UpdateStudentForm.jsx";
import AssignSubjectToStudentForm from "./components/AssignSubjectToStudentForm.jsx";
import SubjectsOfAStudentTable from "./components/SubjectsOfAStudentTable.jsx";
import PayFeeForm from "./components/PayFeeForm.jsx";

const StudentDetailsPage = () => {
  const { studentId } = useParams(); // Get teacherId from the route parameters
  const [student, setStudent] = useState(null); // State to hold the teacher details

  // Fetch teacher data on mount
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await getSpecificStudent(studentId);
        setStudent(response);
      } catch (error) {
        console.error("Failed to fetch student data:", error);
        // Handle error (e.g., set error state or show a message)
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SideMenu />
      {/* Main content */}
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: "auto",
        })}
      >
        <Stack
          sx={{
            alignItems: "stretch",
            mx: 3,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header />
          <Grid container spacing={10}>
            <Grid item xs={12} md={6}>
              {/* Pass the classroom data to ClassroomDetailsCard */}
              {student && <StudentDetailsCard student={student} />}
            </Grid>
            <Grid item xs={12} md={6}>
              {<AssignSubjectToStudentForm />}
            </Grid>

            <Grid item xs={12} md={6}>
              {student && <SubjectsOfAStudentTable student={student} />}
            </Grid>

            <Grid item xs={12} md={6}>
              {student && <UpdateStudentForm student={student} />}
            </Grid>

            <Grid item xs={12} md={6}>
              {student && <PayFeeForm student={student} />}
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
};

export default StudentDetailsPage;
