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
import SitemarkIcon from "../../../../../home/components/SitemarkIcon";
import { getAdminById } from "../../../../../services/adminEndpoints";

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
  const [admin, setAdmin] = React.useState(null);

  React.useEffect(() => {
    const fetchAdminData = async () => {
      const adminId = localStorage.getItem("user_id_fk");
      if (adminId) {
        try {
          const response = await getAdminById(adminId);
          setAdmin(response.admin);
        } catch (error) {
          console.error("Failed to fetch student data:", error);
        }
      }
    };

    fetchAdminData();
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      {/* Top Section */}
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

      {/* Bottom Section */}
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt={`${
            admin
              ? `${admin.admin_first_name} ${admin.admin_last_name}`
              : "Admin"
          }`}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {admin
              ? `${admin.admin_first_name} ${admin.admin_last_name}`
              : "Loading..."}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {admin
              ? `${admin.admin_first_name} ${admin.admin_last_name}`
              : "Loading..."}
          </Typography>
        </Box>
        <ProfileMenu />
      </Stack>
    </Drawer>
  );
}
