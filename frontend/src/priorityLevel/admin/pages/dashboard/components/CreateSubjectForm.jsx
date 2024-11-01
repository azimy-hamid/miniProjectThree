import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  Typography,
  Card as MuiCard,
  Grid,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { createSubject } from "../../../../../services/subjectEndpoints";
import { getAllClassroomCodes } from "../../../../../services/classroomEndpoints";
import { getAllSemestersNumbers } from "../../../../../services/semesterEndpoints";
import { getAllGradeCodes } from "../../../../../services/gradeEndpoints";
import { getAllTeacherCodes } from "../../../../../services/teacherEndpoints"; // New service for teacher codes

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "600px",
  },
}));

const CreateSubjectFormContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  marginTop: theme.spacing(18),
}));

const CreateSubjectForm = () => {
  const [formData, setFormData] = useState({
    subject_name: "",
    classroom_code: "",
    semester_number: "",
    section: "",
    grade_code: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    teacher_code: "", // Added teacher_code
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [classroomCodes, setClassroomCodes] = useState([]);
  const [semesterNumbers, setSemesterNumbers] = useState([]);
  const [gradeCodes, setGradeCodes] = useState([]);
  const [teacherCodes, setTeacherCodes] = useState([]); // State for teacher codes
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          classroomCodes,
          { semesterNumbers },
          { gradeCodes },
          { teacherCodes },
        ] = await Promise.all([
          getAllClassroomCodes(),
          getAllSemestersNumbers(),
          getAllGradeCodes(),
          getAllTeacherCodes(), // Fetch teacher codes
        ]);
        setClassroomCodes(classroomCodes);
        setSemesterNumbers(semesterNumbers);
        setGradeCodes(gradeCodes);
        setTeacherCodes(teacherCodes); // Set teacher codes
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleDayChange = (event) => {
    const { value } = event.target;
    setSelectedDays(
      (prevSelected) =>
        prevSelected.includes(value)
          ? prevSelected.filter((day) => day !== value) // Remove day if already selected
          : [...prevSelected, value] // Add day if not selected
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const daysOfWeekString = selectedDays.join(", ");

    const {
      subject_name,
      classroom_code,
      semester_number,
      grade_code,
      start_time,
      end_time,
      teacher_code, // Include teacher_code in submission
    } = formData;

    if (
      !subject_name ||
      !classroom_code ||
      !semester_number ||
      !grade_code ||
      !selectedDays ||
      !start_time ||
      !end_time ||
      !teacher_code
    ) {
      setNotification({
        open: true,
        message: "All fields are required.",
        severity: "error",
      });
      return;
    }

    const formDataWithDays = {
      ...formData,
      day_of_week: daysOfWeekString,
    };

    try {
      const response = await createSubject(formDataWithDays);
      console.log(response);
      setNotification({
        open: true,
        message: response.createSubjectMessage,
        severity: "success",
      });
      setFormData({
        subject_name: "",
        classroom_code: "",
        semester_number: "",
        section: "",
        grade_code: "",
        start_time: "",
        end_time: "",
        teacher_code: "", // Reset teacher_code
      });
      setSelectedDays([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.createSubjectMessage ||
        "Failed to create subject. Please try again.";
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <CreateSubjectFormContainer>
      <Card variant="outlined">
        <Typography component="h1" variant="h4">
          Create Subject
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="subject_name">Subject Name</FormLabel>
                <TextField
                  id="subject_name"
                  name="subject_name"
                  value={formData.subject_name}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="classroom_code">Classroom Code</FormLabel>
                <Autocomplete
                  id="classroom_code"
                  options={classroomCodes}
                  getOptionLabel={(option) => option}
                  value={formData.classroom_code}
                  onChange={(event, newValue) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      classroom_code: newValue || "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="classroom_code"
                      variant="outlined"
                      placeholder="Search Classroom Code"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="semester_number">Semester Number</FormLabel>
                <Autocomplete
                  id="semester_number"
                  options={semesterNumbers}
                  getOptionLabel={(option) => option}
                  value={formData.semester_number}
                  onChange={(event, newValue) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      semester_number: newValue || "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="semester_number"
                      variant="outlined"
                      placeholder="Select Semester Number"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="grade_code">Grade Code</FormLabel>
                <Autocomplete
                  id="grade_code"
                  options={gradeCodes}
                  getOptionLabel={(option) => option}
                  value={formData.grade_code}
                  onChange={(event, newValue) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      grade_code: newValue || "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="grade_code"
                      variant="outlined"
                      placeholder="Select Grade Code"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="section">Section</FormLabel>
                <TextField
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="teacher_code">Teacher Code</FormLabel>
                <Autocomplete
                  id="teacher_code"
                  options={teacherCodes}
                  getOptionLabel={(option) => option}
                  value={formData.teacher_code}
                  onChange={(event, newValue) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      teacher_code: newValue || "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="teacher_code"
                      variant="outlined"
                      placeholder="Select Teacher Code"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="start_time">Start Time</FormLabel>
                <TextField
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="end_time">End Time</FormLabel>
                <TextField
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <FormLabel>Day of the Week</FormLabel>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {daysOfWeek.map((day) => (
                    <FormControlLabel
                      key={day}
                      control={
                        <Checkbox
                          checked={selectedDays.includes(day)}
                          onChange={handleDayChange}
                          value={day}
                          color="primary"
                        />
                      }
                      label={day}
                    />
                  ))}
                </Box>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Card>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </CreateSubjectFormContainer>
  );
};

export { CreateSubjectForm };
