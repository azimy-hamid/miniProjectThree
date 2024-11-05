import React, { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "./components/Header";
import { alpha } from "@mui/material/styles";
import { getClassroomById } from "../../../../services/classroomEndpoints.js";
import { useParams } from "react-router-dom"; // Import useParams
import Grid from "@mui/material/Grid"; // Import Grid component
import ClassroomDetailsCard from "./components/ClassroomDetailsCard.jsx";
import UpdateClassroomForm from "./components/UpdateClassroomForm.jsx";
import ClassroomScheduleDetails from "./components/ClassroomScheduleDetails.jsx";

const ClassroomDetailsPage = () => {
  const { classroomId } = useParams(); // Get teacherId from the route parameters
  const [classroom, setClassroom] = useState(null); // State to hold the teacher details

  // Fetch teacher data on mount
  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const response = await getClassroomById(classroomId);
        setClassroom(response); // Set the fetched teacher data
      } catch (error) {
        console.error("Failed to fetch teacher data:", error);
        // Handle error (e.g., set error state or show a message)
      }
    };

    if (classroomId) {
      fetchClassroomData();
    }
  }, [classroomId]);

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
              {/* Pass the classroom data to ClassroomDetailsCard */}
              {classroom && <ClassroomDetailsCard classroom={classroom} />}
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Pass the teacher data to UpdateTeacherForm */}
              {classroom && <UpdateClassroomForm classroom={classroom} />}
            </Grid>

            <Grid item xs={12} md={12}>
              {<ClassroomScheduleDetails />}
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
};

export default ClassroomDetailsPage;
