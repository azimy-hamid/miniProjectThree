import * as React from "react";

import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar.jsx";
import Header from "./components/Header.jsx";
// import MainGrid from "./components/MainGrid.jsx";
import SideMenu from "./components/SideMenu.jsx";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../../../../theme/customizations/index.js";
import Grid from "@mui/material/Grid"; // Import Grid component
import { NumberOfStudentsChart } from "./components/NumberOfStudentsChart.jsx";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function AdminDashboard(props) {
  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu />
      <AppNavbar />
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
          spacing={2}
          sx={{
            alignItems: "center",
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header />
          {/* <MainGrid /> */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {<NumberOfStudentsChart />}
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
}
