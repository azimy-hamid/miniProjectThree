import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Sitemark from "./SitemarkIcon";
import ColorModeIconDropdown from "../../theme/ColorModeIconDropdown.jsx";

// Import Link from react-router-dom
import { Link } from "react-router-dom";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: 10,
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <Sitemark />
            </Link>{" "}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {/* Wrap Buttons with Link for navigation */}
              <Button
                variant="text"
                color="info"
                size="small"
                component={Link}
                to="/"
              >
                Features
              </Button>

              <Button
                variant="text"
                color="info"
                size="small"
                component={Link}
                to="/"
              >
                Testimonials
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                component={Link}
                to="/"
              >
                Highlights
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                component={Link}
                to="/"
              >
                Pricing
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
                component={Link}
                to="/"
              >
                FAQ
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
                component={Link}
                to="/"
              >
                Blog
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              size="small"
              component={Link}
              to="/signin"
            >
              Sign in
            </Button>
            {/* <Button
              color="primary"
              variant="contained"
              size="small"
              component={Link}
              to="/signup"
            >
              Sign up
            </Button> */}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { sm: "flex", md: "none" } }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ my: 3 }} />
                {/* Drawer links */}
                <MenuItem
                  component={Link}
                  to="/features"
                  onClick={toggleDrawer(false)}
                >
                  Features
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/testimonials"
                  onClick={toggleDrawer(false)}
                >
                  Testimonials
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/highlights"
                  onClick={toggleDrawer(false)}
                >
                  Highlights
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/pricing"
                  onClick={toggleDrawer(false)}
                >
                  Pricing
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/faq"
                  onClick={toggleDrawer(false)}
                >
                  FAQ
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/blog"
                  onClick={toggleDrawer(false)}
                >
                  Blog
                </MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    component={Link}
                    to="/signup"
                  >
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="outlined"
                    fullWidth
                    component={Link}
                    to="/signin"
                  >
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
