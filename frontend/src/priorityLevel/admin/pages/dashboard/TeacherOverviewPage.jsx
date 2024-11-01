import React from "react";
import SideMenu from "./components/SideMenu";
import CreateTeacherForm from "./components/CreateTeacherForm";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "./components/Header";
import { alpha } from "@mui/material/styles";
import { Typography, Grid } from "@mui/material"; // Import Grid component
import AllTeachersTable from "./components/AllTeachersTable.jsx";

const TeacherOverviewPage = () => {
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
            mt: { xs: 8, md: 3 },
          }}
        >
          <Header />
          {/* Grid layout for table and form */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <AllTeachersTable />
            </Grid>
            <Grid item xs={12} md={5}>
              <CreateTeacherForm />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
};

export default TeacherOverviewPage;
