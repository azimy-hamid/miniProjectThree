import React, { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "./components/Header";
import { alpha } from "@mui/material/styles";
import UpdateTeacherForm from "./components/UpdateTeacherForm.jsx";
import { getTeacherById } from "../../../../services/teacherEndpoints.js";
import { useParams } from "react-router-dom"; // Import useParams
import TeacherDetailsCard from "./components/TeacherDetailsCard.jsx";
import Grid from "@mui/material/Grid"; // Import Grid component
import AssignedSubjectsTable from "./components/AssignedSubjectsTable.jsx";

const TeacherDetailsPage = () => {
  const { teacherId } = useParams(); // Get teacherId from the route parameters
  const [teacher, setTeacher] = useState(null); // State to hold the teacher details

  // Fetch teacher data on mount
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await getTeacherById(teacherId);
        setTeacher(response); // Set the fetched teacher data
      } catch (error) {
        console.error("Failed to fetch teacher data:", error);
        // Handle error (e.g., set error state or show a message)
      }
    };

    if (teacherId) {
      fetchTeacherData();
    }
  }, [teacherId]);

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
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {/* Pass the teacher data to TeacherDetailsCard */}
              {teacher && <TeacherDetailsCard teacher={teacher} />}
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Pass the teacher data to UpdateTeacherForm */}
              {teacher && <UpdateTeacherForm teacher={teacher} />}
            </Grid>

            <Grid item xs={12} md={12}>
              {/* Pass the teacher data to UpdateTeacherForm */}
              {<AssignedSubjectsTable />}
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
};

export default TeacherDetailsPage;
