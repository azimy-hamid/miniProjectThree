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
import { createStudent } from "../../../../../services/studentEndpoints.js";
import {
  signupUser,
  checkUserExists,
} from "../../../../../services/userAuth.js";

import { getAllGradeCodes } from "../../../../../services/gradeEndpoints.js";
import { getAllSemestersNumbers } from "../../../../../services/semesterEndpoints.js";

const Card = styled(MuiCard)(({ theme }) => ({
  // display: "flex",
  // flexDirection: "column",
  // alignSelf: "center",
  // width: "100%",
  // padding: theme.spacing(4),
  // gap: theme.spacing(2),
  // margin: "auto",
  // [theme.breakpoints.up("sm")]: {
  //   maxWidth: "450px",
  // },
}));

const CreateStudentFormContainer = styled(Stack)(({ theme }) => ({
  // minHeight: "100%",
  // padding: theme.spacing(2),
  // marginTop: theme.spacing(18),
}));

export default function CreateStudentForm() {
  const [formData, setFormData] = React.useState({
    student_first_name: "",
    student_last_name: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    join_date: "",
    password: "",
    username: "",
    grade_code: "",
    semester_number: "", // Added field for semester number
  });

  const [gradeCodes, setGradeCodes] = React.useState([]);
  const [semesterNumbers, setSemesterNumbers] = React.useState([]); // Store fetched semester numbers
  const [errors, setErrors] = React.useState({});
  const [generalError, setGeneralError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  React.useEffect(() => {
    const fetchGradeCodes = async () => {
      try {
        const response = await getAllGradeCodes();
        setGradeCodes(response.gradeCodes);
      } catch (error) {
        console.error("Failed to fetch grade codes:", error);
      }
    };

    const fetchSemesterNumbers = async () => {
      try {
        const response = await getAllSemestersNumbers();
        setSemesterNumbers(response.semesterNumbers);
      } catch (error) {
        console.error("Failed to fetch semester numbers:", error);
      }
    };

    fetchGradeCodes();
    fetchSemesterNumbers();
  }, []);

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
      "student_first_name",
      "student_last_name",
      "gender",
      "dob",
      "email",
      "phone",
      "join_date",
      "password",
      "username",
      "grade_code",
      "semester_number", // Ensure semester number is validated
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate password
    if (formData.password && formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters long, contain uppercase and lowercase letters, and a special character.";
    }

    // Validate DOB - must not be in the future
    if (formData.dob) {
      const today = new Date();
      const dobDate = new Date(formData.dob);
      const fiveYearsAgo = new Date(today.setFullYear(today.getFullYear() - 5));

      if (dobDate > today) {
        newErrors.dob = "Date of birth cannot be in the future.";
      } else if (dobDate > fiveYearsAgo) {
        newErrors.dob = "Date of birth must be at least 5 years ago.";
      }
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
      const studentResponse = await createStudent({
        student_first_name: formData.student_first_name,
        student_last_name: formData.student_last_name,
        gender: formData.gender,
        dob: formData.dob,
        email: formData.email,
        phone: formData.phone || null,
        join_date: formData.join_date || null,
        grade_code: formData.grade_code,
        semester_number: formData.semester_number, // Include selected semester number
      });

      if (studentResponse?.newStudent) {
        const newStudent = studentResponse.newStudent;

        const userResponse = await signupUser({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          user_id_fk: newStudent.student_id_pk,
          user_type: "student",
        });

        if (userResponse?.token) {
          setGeneralError("");
          setSuccessMessage("Student and user account created successfully!");
          setFormData({
            student_first_name: "",
            student_last_name: "",
            gender: "",
            dob: "",
            email: "",
            phone: "",
            join_date: "",
            password: "",
            username: "",
            grade_code: "",
            semester_number: "",
          });

          setOpenSnackbar(true);
        }
      }
    } catch (error) {
      setGeneralError(
        error.response?.createStudentMessage ||
          error.response?.signupUserMessage ||
          "Failed to create student and user."
      );
    }
  };

  return (
    <CreateStudentFormContainer
      direction="column"
      justifyContent="space-between"
    >
      <Card variant="outlined">
        <Typography component="h1" variant="h4">
          Create Student
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
              "student_first_name",
              "student_last_name",
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
                  <MenuItem value="">Select Grade Code</MenuItem>
                  {gradeCodes.map((code) => (
                    <MenuItem key={code} value={code}>
                      {code}
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
                <FormLabel htmlFor="semester_number">Semester</FormLabel>
                <Select
                  id="semester_number"
                  name="semester_number"
                  value={formData.semester_number}
                  onChange={handleChange}
                  error={!!errors.semester_number}
                  displayEmpty
                >
                  <MenuItem value="">Select Semester</MenuItem>
                  {semesterNumbers.map((number) => (
                    <MenuItem key={number} value={number}>
                      Semester {number}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="error">
                  {errors.semester_number}
                </Typography>
              </FormControl>
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" fullWidth>
            Create Student
          </Button>
        </Box>
        <Typography variant="body2" color="error" align="center">
          {generalError}
        </Typography>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={successMessage}
      />
    </CreateStudentFormContainer>
  );
}
