import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import ColorModeIconDropdown from "../../../../../theme/ColorModeIconDropdown.jsx";
import ProfileMenu from "./profileBtn.jsx";

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6" component="div">
          Student's Portal
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ gap: 1 }}>
        <ColorModeIconDropdown />
        <ProfileMenu />
      </Stack>
    </Stack>
  );
}
