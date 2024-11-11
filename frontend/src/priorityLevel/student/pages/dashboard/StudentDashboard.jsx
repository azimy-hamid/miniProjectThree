import React, { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu.jsx";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "./components/Header.jsx";
import { alpha } from "@mui/material/styles";
import { getSpecificStudent } from "../../../../services/studentEndpoints.js";
import Grid from "@mui/material/Grid"; // Import Grid component
import AllSubjectsForTheStudentTable from "./components/AllSubjectsForTheStudent.jsx";

const StudentDashboard = () => {
  const studentId = localStorage.getItem("user_id_fk");
  const [student, setStudent] = useState(null); // State to hold the Student details

  // Fetch Student data on mount
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await getSpecificStudent(studentId);
        setStudent(response); // Set the fetched Student data
      } catch (error) {
        console.error("Failed to fetch Student data:", error);
        // Handle error (e.g., set error state or show a message)
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* <SideMenu /> */}
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
          container
          sx={{
            alignItems: "stretch",
            mx: 3,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header />
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              {student && <AllSubjectsForTheStudentTable student={student} />}
            </Grid>
            {/* <Grid item xs={12} md={6}>
              {Student && <UpdateStudentForm Student={Student} />}
            </Grid> */}

            {/* <Grid item xs={12} md={12}>
              {<AssignedSubjectsTable />}
            </Grid> */}
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
