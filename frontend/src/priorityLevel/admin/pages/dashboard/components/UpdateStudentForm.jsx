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
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { updateStudent } from "../../../../../services/studentEndpoints.js";
import { getAllGradeCodes } from "../../../../../services/gradeEndpoints.js";
import { getAllSemestersNumbers } from "../../../../../services/semesterEndpoints.js";

const Card = styled(MuiCard)(({ theme }) => ({
  // Additional styles here if needed
}));

const UpdateStudentFormContainer = styled(Stack)(({ theme }) => ({
  // Additional styles here if needed
}));

export default function UpdateStudentForm({ student }) {
  const { studentId } = useParams();
  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  const [formData, setFormData] = React.useState({
    student_first_name: student?.student_first_name || "",
    student_last_name: student?.student_last_name || "",
    gender: student?.gender || "",
    dob: formatDate(student?.dob) || "",
    email: student?.email || "",
    phone: student?.phone || "",
    join_date: formatDate(student?.join_date) || "",
    grade_code: student?.Grade?.grade_code || "",
    semester_number: student?.Semester?.semester_number || "",
  });

  const [gradeCodes, setGradeCodes] = React.useState([]);
  const [semesterNumbers, setSemesterNumbers] = React.useState([]);
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
      "grade_code",
      "semester_number",
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
      const response = await updateStudent(formData, studentId);

      if (response?.updatedStudent) {
        setGeneralError("");
        setSuccessMessage("Student updated successfully!");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setGeneralError(
        error.response?.data?.updateStudentMessage ||
          "Failed to update student."
      );
    }
  };

  return (
    <UpdateStudentFormContainer
      direction="column"
      justifyContent="space-between"
    >
      <Card variant="outlined">
        <Typography component="h1" variant="h4">
          Update Student
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
                      key === "dob" || key === "join_date" ? "date" : "text"
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
                  value={formData.gender || ""}
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
                  value={
                    gradeCodes.includes(formData.grade_code)
                      ? formData.grade_code
                      : ""
                  }
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
                  value={
                    semesterNumbers.includes(formData.semester_number)
                      ? formData.semester_number
                      : ""
                  }
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
            Update Student
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
    </UpdateStudentFormContainer>
  );
}
