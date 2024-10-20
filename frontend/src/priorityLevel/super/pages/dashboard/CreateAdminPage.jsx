import React from "react";
import SideMenu from "./components/SideMenu";
import CreateAdmin from "./components/CreateAdminForm";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "./components/Header";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const CreateAdminPage = () => {
  return (
    <>
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
            spacing={2}
            sx={{
              alignItems: "stretch",
              mx: 3,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <CreateAdmin />
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default CreateAdminPage;