import React, { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu.jsx";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "./components/Header.jsx";
import { alpha } from "@mui/material/styles";
import { getTeacherById } from "../../../../services/teacherEndpoints.js";
import Grid from "@mui/material/Grid"; // Import Grid component
import AllStudentsOfASubjectTable from "./components/AllStudentsOfASubjectTable.jsx";
import { getSpecificSubject } from "../../../../services/subjectEndpoints.js";
import { useParams } from "react-router-dom";
import SubjectDetailsCard from "./components/SubjectDetailsCard.jsx";
import MarkStudentAttendanceTable from "./components/MarkStudentAttendanceTable.jsx";

const MarkStudentAttendancePage = () => {
  const { subjectId } = useParams();

  const [subject, setSubject] = useState(null); // State to hold the teacher details

  // Fetch teacher data on mount
  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await getSpecificSubject(subjectId);
        setSubject(response.subject); // Set the fetched teacher data
      } catch (error) {
        console.error("Failed to fetch teacher data:", error);
        // Handle error (e.g., set error state or show a message)
      }
    };

    if (subjectId) {
      fetchSubjectData();
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
          <Grid container spacing={2} mt={5}>
            <Grid item xs={12} md={12}>
              {subject && <SubjectDetailsCard subject={subject} />}
            </Grid>
            <Grid item xs={12} md={12}>
              {subject && <MarkStudentAttendanceTable subject={subject} />}
            </Grid>

            {/* <Grid item xs={12} md={12}>
              {<AssignedSubjectsTable />}
            </Grid> */}
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
};

export default MarkStudentAttendancePage;
