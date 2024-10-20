import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, link: "/super/dashboard" },
  {
    text: "Create Admin",
    icon: <AddCircleIcon />,
    link: "/super/create-admin",
  },
  {
    text: "Create Teacher",
    icon: <AddCircleIcon />,
    link: "/super/create-teacher",
  },
  {
    text: "Create Admin",
    icon: <AddCircleIcon />,
    link: "/super/create-student",
  },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, link: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, link: "/about" },
  { text: "Feedback", icon: <HelpRoundedIcon />, link: "/feedback" },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.link}
              selected={index === 0}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
