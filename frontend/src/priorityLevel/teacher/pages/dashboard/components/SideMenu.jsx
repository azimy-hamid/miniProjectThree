import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import ProfileMenu from "./profileBtn";
import { getTeacherById } from "../../../../../services/teacherEndpoints";
import SitemarkIcon from "../../../../../home/components/SitemarkIcon";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100vh",
  },
});

export default function SideMenu() {
  const [teacher, setTeacher] = React.useState(null);

  React.useEffect(() => {
    const fetchTeacherData = async () => {
      const teacherId = localStorage.getItem("user_id_fk");
      if (teacherId) {
        try {
          const response = await getTeacherById(teacherId);
          setTeacher(response);
        } catch (error) {
          console.error("Failed to fetch teacher data:", error);
        }
      }
    };

    fetchTeacherData();
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "column", // Ensures content is arranged vertically
          height: "100vh",
        },
      }}
    >
      {/* Top Section: Logo and MenuContent */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SitemarkIcon sx={{ height: 50, width: 150 }} />{" "}
        <Divider sx={{ width: "100%", my: 2 }} />
        <MenuContent />
      </Box>

      {/* Bottom Section: Teacher details */}
      <Box sx={{ marginTop: "auto", p: 2 }}>
        <Stack
          direction="row"
          sx={{
            gap: 1,
            alignItems: "center",
            borderColor: "divider",
          }}
        >
          <Avatar
            sizes="small"
            alt={`${
              teacher
                ? `${teacher.teacher_first_name} ${teacher.teacher_last_name}`
                : "Teacher"
            }`}
            src="/static/images/avatar/7.jpg"
            sx={{ width: 36, height: 36 }}
          />
          <Box sx={{ mr: "auto" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, lineHeight: "16px" }}
            >
              {teacher
                ? `${teacher.teacher_first_name} ${teacher.teacher_last_name}`
                : "Loading..."}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {teacher ? teacher.email : ""}
            </Typography>
          </Box>
          <ProfileMenu />
        </Stack>
      </Box>
    </Drawer>
  );
}
