import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  MenuItem,
  Select,
  Grid,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { createTeacher } from "../../../../../services/teacherEndpoints.js";
import { signupUser } from "../../../../../services/userAuth.js";

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
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  marginTop: theme.spacing(18),
}));

export default function CreateTeacherForm() {
  const [formData, setFormData] = React.useState({
    teacher_first_name: "",
    teacher_last_name: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    join_date: "",
    working_days: "",
    password: "",
    username: "",
  });

  const [errors, setErrors] = React.useState({});
  const [generalError, setGeneralError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const newErrors = {};
    const requiredFields = [
      "teacher_first_name",
      "teacher_last_name",
      "gender",
      "dob",
      "email",
      "working_days",
      "password",
      "username",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters long, contain uppercase and lowercase letters, and a special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      const teacherResponse = await createTeacher({
        teacher_first_name: formData.teacher_first_name,
        teacher_last_name: formData.teacher_last_name,
        gender: formData.gender,
        dob: formData.dob,
        email: formData.email,
        phone: formData.phone || null,
        join_date: formData.join_date || null,
        working_days: formData.working_days,
      });

      if (teacherResponse?.newTeacher) {
        const newTeacher = teacherResponse.newTeacher;

        const userResponse = await signupUser({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          user_id_fk: newTeacher.teacher_id_pk,
          user_type: "teacher",
        });

        if (userResponse?.token) {
          setGeneralError("");
          setSuccessMessage("Teacher and user account created successfully!");
          setFormData({
            teacher_first_name: "",
            teacher_last_name: "",
            gender: "",
            dob: "",
            email: "",
            phone: "",
            join_date: "",
            working_days: "",
            password: "",
            username: "",
          });

          setOpenSnackbar(true);
        }
      }
    } catch (error) {
      setGeneralError(
        error.response?.createTeacherMessage ||
          error.response?.signupUserMessage ||
          "Failed to create teacher and user."
      );
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography component="h1" variant="h4">
          Create Teacher
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
          <Grid container spacing={2}>
            {[
              "teacher_first_name",
              "teacher_last_name",
              "dob",
              "email",
              "phone",
              "join_date",
              "password",
              "username",
            ].map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <FormControl fullWidth>
                  <FormLabel htmlFor={key}>{key.replace(/_/g, " ")}</FormLabel>
                  <TextField
                    error={!!errors[key]}
                    helperText={errors[key]}
                    id={key}
                    name={key}
                    type={
                      key === "dob" || key === "join_date"
                        ? "date"
                        : key === "password"
                        ? "password"
                        : "text"
                    }
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="gender">Gender</FormLabel>
                <Select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  error={!!errors.gender}
                  displayEmpty
                >
                  <MenuItem value="">Select gender</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="prefer not to say">
                    Prefer not to say
                  </MenuItem>
                </Select>
                <Typography variant="caption" color="error">
                  {errors.gender}
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="working_days">Working Days</FormLabel>
                <Select
                  id="working_days"
                  name="working_days"
                  value={formData.working_days}
                  onChange={handleChange}
                  error={!!errors.working_days}
                  displayEmpty
                >
                  <MenuItem value="">Select working days</MenuItem>
                  {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                    "weekdays",
                    "weekends",
                    "full week",
                  ].map((day) => (
                    <MenuItem key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="error">
                  {errors.working_days}
                </Typography>
              </FormControl>
            </Grid>
          </Grid>

          {generalError && (
            <Typography color="error" variant="body2">
              {generalError}
            </Typography>
          )}

          <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">
              Create Teacher
            </Button>
          </Stack>
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
