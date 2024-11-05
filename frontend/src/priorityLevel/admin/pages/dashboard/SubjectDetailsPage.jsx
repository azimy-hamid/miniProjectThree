import React, { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "./components/Header";
import { alpha } from "@mui/material/styles";
import { useParams } from "react-router-dom"; // Import useParams
import Grid from "@mui/material/Grid"; // Import Grid component
import { getSpecificSubject } from "../../../../services/subjectEndpoints.js";
import SubjectDetailsCard from "./components/SubjectDetailsCard.jsx";
import { UpdateSubjectForm } from "./components/UpdateSubjectForm.jsx";

const SubjectDetailsPage = () => {
  const { subjectId } = useParams(); // Get teacherId from the route parameters
  const [subject, setSubject] = useState(null); // State to hold the teacher details

  // Fetch teacher data on mount
  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const response = await getSpecificSubject(subjectId);
        setSubject(response.subject);
      } catch (error) {
        console.error("Failed to fetch teacher data:", error);
        // Handle error (e.g., set error state or show a message)
      }
    };

    if (subjectId) {
      fetchClassroomData();
    }
  }, [subjectId]);

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
              {subject && <SubjectDetailsCard subject={subject} />}
            </Grid>
            <Grid item xs={12} md={6}>
              {subject && <UpdateSubjectForm subject={subject} />}
            </Grid>

            {/* <Grid item xs={12} md={12}>
              {<ClassroomScheduleDetails />}
            </Grid> */}
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
};

export default SubjectDetailsPage;
