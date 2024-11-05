import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgetPassword.jsx";
import { GoogleIcon, FacebookIcon, SitemarkIcon } from "./CustomIcons";
import { loginUser } from "../../../services/userAuth.js"; // Ensure the path is correct

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  marginTop: theme.spacing(18),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn(props) {
  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [apiError, setApiError] = React.useState(""); // For API error messages
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const isValid = validateInputs(); // Validate inputs
    if (!isValid) return; // Stop if inputs are invalid

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = { username, email, password }; // Prepare data for login

    try {
      const data = await loginUser(userData); // Call loginUser with user data

      if (data.token && data.role) {
        // Store the token and role in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // Navigate based on the user's role
        switch (data.role) {
          case "admin":
            window.location.href = "/admin/dashboard";
            break;
          case "teacher":
            window.location.href = "/teacher/dashboard";
            break;
          case "student":
            window.location.href = "/student/dashboard";
            break;
          case "super":
            window.location.href = "/super/dashboard";
            break;
          default:
            console.error("Unknown role:", data.role);
            break;
        }
      }
    } catch (error) {
      // Extract error message from the response or set a generic message
      const errorMsg =
        error.response?.data?.loginUserMessage ||
        "Login failed. Please try again.";
      console.error("Login failed:", errorMsg);
      setApiError(errorMsg); // Set the API error message
    }
  };

  const validateInputs = () => {
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    // Validate Username
    if (!username.value) {
      setUsernameError(true);
      setUsernameErrorMessage("Username is required.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    // Validate Email
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Validate Password
    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <SitemarkIcon />
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <TextField
              error={usernameError}
              helperText={usernameErrorMessage}
              id="username"
              type="text"
              name="username"
              placeholder="your_username"
              required
              fullWidth
              variant="outlined"
              color={usernameError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: "baseline" }}
              >
                Forgot your password?
              </Link>
            </Box> */}
            <TextField
              error={passwordError || Boolean(apiError)} // Show error if API error exists
              helperText={passwordError ? passwordErrorMessage : apiError} // Show password error or API error message
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              color={passwordError || Boolean(apiError) ? "error" : "primary"}
            />
          </FormControl>
          <ForgotPassword open={open} handleClose={handleClose} />
          <Button type="submit" fullWidth variant="contained">
            Sign in
          </Button>
          {/* <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <span>
              <Link
                href="/material-ui/signup"
                variant="body2"
                sx={{ textDecoration: "underline" }}
              >
                Sign Up
              </Link>
            </span>
          </Typography> */}
          <Divider />
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span>or</span>
            <GoogleIcon />
            <FacebookIcon />
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
}
