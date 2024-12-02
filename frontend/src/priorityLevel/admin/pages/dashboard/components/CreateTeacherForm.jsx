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
  FormGroup,
  FormControlLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { styled } from "@mui/material/styles";
import { createTeacher } from "../../../../../services/teacherEndpoints.js";
import {
  signupUser,
  checkUserExists,
} from "../../../../../services/userAuth.js";

import { getAllGrades } from "../../../../../services/gradeEndpoints.js";

const Card = styled(MuiCard)(({ theme }) => ({
  // styling options
}));

const CreateTeacherFormContainer = styled(Stack)(({ theme }) => ({
  // styling options
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
    working_days: [],
    password: "",
    username: "",
    grade_code: "", // Add grade_code
  });

  const [errors, setErrors] = React.useState({});
  const [generalError, setGeneralError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [grades, setGrades] = React.useState([]); // Store grades for dropdown

  React.useEffect(() => {
    // Fetch grades on component mount
    const fetchGrades = async () => {
      try {
        const gradesData = await getAllGrades();
        console.log(gradesData);
        setGrades(gradesData.grades);
      } catch (error) {
        console.error("Failed to fetch grades:", error);
      }
    };
    fetchGrades();
  }, []);

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
      "password",
      "username",
      "grade_code", // Validate grade_code
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

    if (formData.working_days.length === 0) {
      newErrors.working_days = "At least one working day must be selected.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const userCheckResponse = await checkUserExists(
      formData.username,
      formData.email
    );

    if (userCheckResponse.userExists) {
      setGeneralError(userCheckResponse.checkUserExistsMessage);
      return;
    }

    try {
      const teacherResponse = await createTeacher({
        teacher_first_name: formData.teacher_first_name,
        teacher_last_name: formData.teacher_last_name,
        gender: formData.gender,
        dob: formData.dob,
        email: formData.email,
        phone: formData.phone || null,
        join_date: formData.join_date || null,
        working_days: formData.working_days.join(","),
        grade_code: formData.grade_code, // Send grade_code
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
            working_days: [],
            password: "",
            username: "",
            grade_code: "", // Reset grade_code
          });

          setOpenSnackbar(true);
        }
      }
    } catch (error) {
      setGeneralError(
        error.response?.data?.createTeacherMessage ||
          error.response?.signupUserMessage ||
          "Failed to create teacher and user."
      );
    }
  };

  return (
    <CreateTeacherFormContainer
      direction="column"
      justifyContent="space-between"
    >
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
                  <FormLabel htmlFor={key}>
                    {key.replace(/_/g, " ")}
                    {key === "password" && (
                      <Tooltip
                        title="Password must contain at least one capital letter, one number, and one special character."
                        arrow
                      >
                        <span style={{ marginLeft: 4 }}>
                          <InfoOutlinedIcon
                            style={{
                              verticalAlign: "middle",
                              fontSize: "1rem",
                            }}
                          />
                        </span>
                      </Tooltip>
                    )}
                  </FormLabel>
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

            <Grid item xs={12}>
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

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="grade_code">Grade Code</FormLabel>
                <Select
                  id="grade_code"
                  name="grade_code"
                  value={formData.grade_code}
                  onChange={handleChange}
                  error={!!errors.grade_code}
                  displayEmpty
                >
                  <MenuItem value="">Select grade</MenuItem>
                  {grades.map((grade) => (
                    <MenuItem key={grade.grade_code} value={grade.grade_code}>
                      {grade.grade_code}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="error">
                  {errors.grade_code}
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel>Working Days</FormLabel>
                <Grid container spacing={2}>
                  {["monday", "tuesday", "wednesday", "thursday", "friday"].map(
                    (day) => (
                      <Grid item xs={4} key={day}>
                        <FormGroup>
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
                        </FormGroup>
                      </Grid>
                    )
                  )}
                </Grid>
                <Typography variant="caption" color="error">
                  {errors.working_days}
                </Typography>
              </FormControl>
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" color="primary">
            Create Teacher
          </Button>
          {generalError && (
            <Typography variant="caption" color="error">
              {generalError}
            </Typography>
          )}
        </Box>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={successMessage}
      />
    </CreateTeacherFormContainer>
  );
}
