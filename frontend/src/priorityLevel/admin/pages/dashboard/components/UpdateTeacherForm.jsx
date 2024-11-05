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
  Grid,
  Snackbar,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { updateTeacher } from "../../../../../services/teacherEndpoints.js";

const Card = styled(MuiCard)(({ theme }) => ({
  // Customize Card styles if needed
}));

const UpdateTeacherFormContainer = styled(Stack)(({ theme }) => ({
  // Customize container styles if needed
}));

export default function UpdateTeacherForm({ teacher }) {
  const [formData, setFormData] = React.useState({
    teacher_first_name: teacher?.teacher_first_name || "",
    teacher_last_name: teacher?.teacher_last_name || "",
    gender: teacher?.gender || "",
    dob: teacher?.dob ? teacher.dob.split("T")[0] : "",
    email: teacher?.email || "",
    phone: teacher?.phone || "",
    join_date: teacher?.join_date ? teacher.join_date.split("T")[0] : "",
    working_days: teacher?.working_days || [],
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

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const workingDays = prevData.working_days.includes(value)
        ? prevData.working_days.filter((day) => day !== value)
        : [...prevData.working_days, value];
      return { ...prevData, working_days: workingDays };
    });
  };

  const validateInputs = () => {
    const newErrors = {};
    const requiredFields = [
      "teacher_first_name",
      "teacher_last_name",
      "gender",
      "dob",
      "email",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      const response = await updateTeacher(teacher._id, formData);
      if (response.updateTeacherMessage) {
        setGeneralError("");
        setSuccessMessage("Teacher details updated successfully!");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setGeneralError("Failed to update teacher details. Please try again.");
    }
  };

  return (
    <Card variant="outlined">
      <Typography variant="h4" sx={{ color: "primary.main" }}>
        Update {`${formData.teacher_first_name} ${formData.teacher_last_name}`}
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
          ].map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              <FormControl fullWidth>
                <FormLabel htmlFor={key}>{key.replace(/_/g, " ")}</FormLabel>
                <TextField
                  error={!!errors[key]}
                  helperText={errors[key]}
                  id={key}
                  name={key}
                  type={key === "dob" || key === "join_date" ? "date" : "text"}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </Grid>
          ))}

          <Grid item xs={12} sm={12}>
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
                <MenuItem value="prefer not to say">Prefer not to say</MenuItem>
              </Select>
              <Typography variant="caption" color="error">
                {errors.gender}
              </Typography>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel>Working Days</FormLabel>
              <Grid container spacing={2}>
                {[
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ].map((day) => (
                  <Grid item xs={4} key={day}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.working_days.includes(day)}
                          onChange={handleCheckboxChange}
                          value={day}
                        />
                      }
                      label={day.charAt(0).toUpperCase() + day.slice(1)}
                    />
                  </Grid>
                ))}
              </Grid>
              {errors.working_days && (
                <Typography variant="caption" color="error">
                  {errors.working_days}
                </Typography>
              )}
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
            Update Teacher
          </Button>
        </Stack>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={successMessage}
      />
    </Card>
  );
}
