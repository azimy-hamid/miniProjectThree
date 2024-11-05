import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { assignSubject } from "../../../../../services/studentSubjectEndpoints.js";
import { getAllSubjectCodes } from "../../../../../services/subjectEndpoints.js";

const Card = styled(MuiCard)(({ theme }) => ({
  // Additional styles here if needed
}));

const AssignSubjectToStudentFormContainer = styled(Stack)(({ theme }) => ({
  // Additional styles here if needed
}));

export default function AssignSubjectToStudentForm() {
  const { studentId } = useParams(); // Get the student ID from URL params
  const [subjectCodes, setSubjectCodes] = React.useState([]); // State for subject codes
  const [formData, setFormData] = React.useState({
    subject_code: "", // Field for subject code
  });

  const [errors, setErrors] = React.useState({});
  const [generalError, setGeneralError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  React.useEffect(() => {
    const fetchSubjectCodes = async () => {
      try {
        const response = await getAllSubjectCodes();
        setSubjectCodes(response.subjectCodes);
      } catch (error) {
        console.error("Failed to fetch subject codes:", error);
      }
    };

    fetchSubjectCodes(); // Fetch subject codes on component mount
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
    if (!formData.subject_code) {
      newErrors.subject_code = "Subject code is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      // Use the assignSubject function to send the data
      const response = await assignSubject({
        student_id_fk: studentId, // Send the student ID from the URL
        subject_code: formData.subject_code, // Send the selected subject code
      });

      if (response?.newStudentSubject) {
        setGeneralError("");
        setSuccessMessage("Subject assigned to student successfully!");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setGeneralError(
        error.response?.data?.createStudentSubjectMessage ||
          "Failed to assign subject."
      );
    }
  };

  return (
    <AssignSubjectToStudentFormContainer
      direction="column"
      justifyContent="space-between"
    >
      <Card variant="outlined">
        <Typography component="h1" variant="h4">
          Assign Subject to Student
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
          <FormControl fullWidth>
            <FormLabel htmlFor="subject_code">Subject Code</FormLabel>
            <Select
              id="subject_code"
              name="subject_code"
              value={formData.subject_code || ""}
              onChange={handleChange}
              error={!!errors.subject_code}
              displayEmpty
            >
              <MenuItem value="">Select Subject Code</MenuItem>
              {subjectCodes.map((code) => (
                <MenuItem key={code} value={code}>
                  {code}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="error">
              {errors.subject_code}
            </Typography>
          </FormControl>

          <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
            <Button type="submit" variant="contained">
              Assign Subject
            </Button>
            <Button variant="outlined" color="error">
              Cancel
            </Button>
          </Stack>

          {generalError && (
            <Typography variant="body2" color="error">
              {generalError}
            </Typography>
          )}
          {successMessage && (
            <Typography variant="body2" color="success.main">
              {successMessage}
            </Typography>
          )}
        </Box>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Subject assigned successfully!"
      />
    </AssignSubjectToStudentFormContainer>
  );
}
