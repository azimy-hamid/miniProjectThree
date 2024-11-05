import React, { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu.jsx";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "./components/Header.jsx";
import { alpha } from "@mui/material/styles";
import { getTeacherById } from "../../../../services/teacherEndpoints.js";
import Grid from "@mui/material/Grid"; // Import Grid component
import AllSubjectsForTheTeacherTable from "./components/AllSubjectsForTheTeacherTable.jsx";

const TeacherSubjectsOverviewPage = () => {
  const teacherId = localStorage.getItem("user_id_fk");
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
            <Grid item xs={12} md={12}>
              {teacher && <AllSubjectsForTheTeacherTable teacher={teacher} />}
            </Grid>
            {/* <Grid item xs={12} md={6}>
              {teacher && <UpdateTeacherForm teacher={teacher} />}
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

export default TeacherSubjectsOverviewPage;
