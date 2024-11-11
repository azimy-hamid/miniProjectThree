// ProfileMenu.js

import {
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../../../../services/userAuth.js";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileNavigation = () => {
    navigate("/updateUserDetails");
    handleMenuClose();
  };

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
    handleMenuClose();
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleConfirmLogout = () => {
    logoutUser();
    window.location.href = "/";
    closeLogoutDialog();
  };

  return (
    <>
      <IconButton
        disableRipple
        size="small"
        aria-controls={open ? "user-profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleProfileClick}
      >
        <PersonOutlinedIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfileNavigation}>Profile</MenuItem>
        {/* Removed the delete profile functionality */}
        <MenuItem onClick={openLogoutDialog}>Logout</MenuItem>
      </Menu>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={closeLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to log out?</DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog}>Cancel</Button>
          <Button onClick={handleConfirmLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileMenu;
