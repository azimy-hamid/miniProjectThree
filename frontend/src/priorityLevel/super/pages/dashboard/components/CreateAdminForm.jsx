import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar
import { styled } from "@mui/material/styles";
import { createAdmin } from "../../../../../services/adminEndpoints.js"; // Ensure the path is correct
import {
  signupUser,
  checkUserExists,
} from "../../../../../services/userAuth.js";

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
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  marginTop: theme.spacing(18),
}));

export default function CreateAdmin(props) {
  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState("");
  const [lastNameError, setLastNameError] = React.useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState("");
  const [generalError, setGeneralError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState(""); // Success message state
  const [openSnackbar, setOpenSnackbar] = React.useState(false); // Snackbar open state

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const isValid = validateInputs(); // Validate inputs
    if (!isValid) return; // Stop if inputs are invalid

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;

    try {
      // Check if the user exists
      const userCheckResponse = await checkUserExists(username, email);

      if (userCheckResponse.userExists) {
        setGeneralError(userCheckResponse.checkUserExistsMessage);
        return; // Stop execution if user exists
      }

      const adminData = {
        username,
        email,
        password,
        first_name,
        last_name,
      }; // Prepare data for admin creation

      const adminUserData = {
        username,
        email,
        password,
      };

      const createdAdminData = await createAdmin(adminData); // Call createAdmin with admin data

      if (createdAdminData.admin) {
        const createdAdminDetails = createdAdminData.admin;
        const admin_id_pk = createdAdminDetails.admin_id_pk;
        adminUserData.user_id_fk = admin_id_pk;
        adminUserData.user_type = "admin";

        await signupUser(adminUserData);
        // Set success message and open Snackbar
        setSuccessMessage("Admin created successfully!");
        setOpenSnackbar(true);
      }
    } catch (error) {
      let errorMsg;

      if (error.response?.data?.createAdminCatchBlkErr) {
        errorMsg = error.response.data.createAdminCatchBlkErr;
        console.log(error.response.data.createAdminCatchBlkErr);
      } else if (error.response?.data?.signupUserCatchBlkErr) {
        errorMsg = error.response.data.signupUserCatchBlkErr;
      } else if (error.response?.data?.signupUserMessage) {
        errorMsg = error.response.data.signupUserMessage;
      } else if (error.response?.data?.createAdminMessage) {
        errorMsg = error.response.data.createAdminMessage;
      } else {
        errorMsg = "Admin creation failed. Please try again.";
      }
      console.log(error);

      setGeneralError(errorMsg); // Set general error message
    }
  };

  const validateInputs = () => {
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const first_name = document.getElementById("first_name");
    const last_name = document.getElementById("last_name");

    let isValid = true;

    // Reset general error message
    setGeneralError("");

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
    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // Validate First Name
    if (!first_name.value) {
      setFirstNameError(true);
      setFirstNameErrorMessage("First name is required.");
      isValid = false;
    } else {
      setFirstNameError(false);
      setFirstNameErrorMessage("");
    }

    // Validate Last Name
    if (!last_name.value) {
      setLastNameError(true);
      setLastNameErrorMessage("Last name is required.");
      isValid = false;
    } else {
      setLastNameError(false);
      setLastNameErrorMessage("");
    }

    return isValid;
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Create Admin
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
            <FormLabel htmlFor="first_name">First Name</FormLabel>
            <TextField
              error={firstNameError}
              helperText={firstNameErrorMessage}
              id="first_name"
              type="text"
              name="first_name"
              placeholder="John"
              required
              fullWidth
              variant="outlined"
              color={firstNameError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="last_name">Last Name</FormLabel>
            <TextField
              error={lastNameError}
              helperText={lastNameErrorMessage}
              id="last_name"
              type="text"
              name="last_name"
              placeholder="Doe"
              required
              fullWidth
              variant="outlined"
              color={lastNameError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              id="password"
              type="password"
              name="password"
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <Button variant="contained" type="submit" fullWidth>
            Create Admin
          </Button>
        </Box>
        {successMessage && (
          <Typography color="success.main">{successMessage}</Typography>
        )}{" "}
        {/* Inline message */}
        {generalError && (
          <Typography color="error.main">{generalError}</Typography>
        )}
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={successMessage}
      />
    </SignInContainer>
  );
}
