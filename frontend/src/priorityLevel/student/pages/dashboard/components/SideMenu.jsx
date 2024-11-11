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
import { getSpecificStudent } from "../../../../../services/studentEndpoints";
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
  const [student, setStudent] = React.useState(null);

  React.useEffect(() => {
    const fetchStudentData = async () => {
      const studentId = localStorage.getItem("user_id_fk");
      if (studentId) {
        try {
          const response = await getSpecificStudent(studentId);
          setStudent(response);
        } catch (error) {
          console.error("Failed to fetch student data:", error);
        }
      }
    };

    fetchStudentData();
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "column",
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
        <SitemarkIcon sx={{ height: 50, width: 150 }} />
        <Divider sx={{ width: "100%", my: 2 }} />
        <MenuContent />
      </Box>

      {/* Bottom Section: Student details */}
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
              student
                ? `${student.student_first_name} ${student.student_last_name}`
                : "Student"
            }`}
            src="/static/images/avatar/7.jpg" // Replace with a dynamic source if available
            sx={{ width: 36, height: 36 }}
          />
          <Box sx={{ mr: "auto" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, lineHeight: "16px" }}
            >
              {student
                ? `${student.student_first_name} ${student.student_last_name}`
                : "Loading..."}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {student ? student.email : ""}
            </Typography>
          </Box>
          <ProfileMenu />
        </Stack>
      </Box>
    </Drawer>
  );
}
