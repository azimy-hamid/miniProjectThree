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
import { getRoleByName } from "../../../../../services/roleEndpoints.js";

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
  // Input states
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  // Error states
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

    try {
      // Check if the user exists
      const userCheckResponse = await checkUserExists(username, email);

      if (userCheckResponse.userExists) {
        setGeneralError(userCheckResponse.checkUserExistsMessage);
        return; // Stop execution if user exists
      }

      const roleCheckResponse = await getRoleByName("admin");
      console.log(roleCheckResponse.getRoleByNameMessage);

      if (roleCheckResponse.getRoleByNameMessage) {
        setGeneralError(roleCheckResponse.getRoleByNameMessage);
        return; // Stop execution if role doesn't exists
      }

      const adminData = {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
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

      if (error.response?.data?.signupUserMessage) {
        errorMsg = error.response.data.signupUserMessage;
      } else if (error.response?.data?.createAdminMessage) {
        errorMsg = error.response.data.createAdminMessage;
      } else if (error.response?.data?.getRoleByNameMessage) {
        errorMsg = error.response.data.getRoleByNameMessage;
      } else {
        errorMsg = "Admin creation failed. Please try again.";
      }
      console.log(error);

      setGeneralError(errorMsg); // Set general error message
    }
  };

  const validateInputs = () => {
    let isValid = true;

    // Reset general error message
    setGeneralError("");

    // Validate Username
    if (!username) {
      setUsernameError(true);
      setUsernameErrorMessage("Username is required.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    // Validate Email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Validate Password
    if (!password || password.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // Validate First Name
    if (!firstName) {
      setFirstNameError(true);
      setFirstNameErrorMessage("First name is required.");
      isValid = false;
    } else {
      setFirstNameError(false);
      setFirstNameErrorMessage("");
    }

    // Validate Last Name
    if (!lastName) {
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
            <FormLabel htmlFor="admin-username">Username</FormLabel>
            <TextField
              error={usernameError}
              helperText={usernameErrorMessage}
              id="admin-username"
              type="text"
              name="username"
              placeholder="your_username"
              required
              fullWidth
              variant="outlined"
              color={usernameError ? "error" : "primary"}
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update state
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="admin-email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="admin-email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "primary"}
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="admin-first_name">First Name</FormLabel>
            <TextField
              error={firstNameError}
              helperText={firstNameErrorMessage}
              id="admin-first_name"
              type="text"
              name="first_name"
              placeholder="John"
              required
              fullWidth
              variant="outlined"
              color={firstNameError ? "error" : "primary"}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)} // Update state
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="admin-last_name">Last Name</FormLabel>
            <TextField
              error={lastNameError}
              helperText={lastNameErrorMessage}
              id="admin-last_name"
              type="text"
              name="last_name"
              placeholder="Doe"
              required
              fullWidth
              variant="outlined"
              color={lastNameError ? "error" : "primary"}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)} // Update state
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="admin-password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              id="admin-password"
              type="password"
              name="password"
              placeholder="********"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update state
            />
          </FormControl>

          {generalError && (
            <Typography
              color="error"
              variant="body2"
              sx={{ fontSize: "0.9rem" }}
            >
              {generalError}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Admin
          </Button>
        </Box>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={successMessage} // Show success message
      />
    </SignInContainer>
  );
}
