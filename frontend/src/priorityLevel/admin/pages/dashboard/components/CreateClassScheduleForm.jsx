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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { createClassSchedule } from "../../../../../services/classScheduleEndpoints.js";
import { getAllClassroomCodes } from "../../../../../services/classroomEndpoints.js";
import { getAllSubjectCodes } from "../../../../../services/subjectEndpoints.js";

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

const CreateClassScheduleFormContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  marginTop: theme.spacing(18),
}));

const CreateClassScheduleForm = () => {
  const [formData, setFormData] = useState({
    subject_code: "",
    classroom_code: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [classroomCodes, setClassroomCodes] = useState([]);
  const [subjectCodes, setSubjectCodes] = useState([]);
  const [daysOfWeek] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]); // Example days of the week

  // Fetch classroom codes and subject codes on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classroomCodes, { subjectCodes }] = await Promise.all([
          getAllClassroomCodes(),
          getAllSubjectCodes(),
        ]);
        setClassroomCodes(classroomCodes);
        setSubjectCodes(subjectCodes);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { subject_code, classroom_code, day_of_week, start_time, end_time } =
      formData;

    if (
      !subject_code ||
      !classroom_code ||
      !day_of_week ||
      !start_time ||
      !end_time
    ) {
      setNotification({
        open: true,
        message: "All fields are required.",
        severity: "error",
      });
      return;
    }

    // Convert day_of_week to lowercase
    const payload = {
      subject_code,
      classroom_code,
      day_of_week: day_of_week.toLowerCase(), // Ensure this is in lowercase
      start_time,
      end_time,
    };

    try {
      const response = await createClassSchedule(payload);
      setNotification({
        open: true,
        message: response.createClassScheduleMessage,
        severity: "success",
      });
      setFormData({
        subject_code: "",
        classroom_code: "",
        day_of_week: "",
        start_time: "",
        end_time: "",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to create class schedule. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <CreateClassScheduleFormContainer>
      <Card variant="outlined">
        <Typography component="h1" variant="h4">
          Create Class Schedule
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="subject_code">Subject Code</FormLabel>
                <Autocomplete
                  id="subject_code"
                  options={subjectCodes}
                  getOptionLabel={(option) => option}
                  value={formData.subject_code}
                  onChange={(event, newValue) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      subject_code: newValue || "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="subject_code"
                      variant="outlined"
                      placeholder="Select Subject Code"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
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
                      placeholder="Select Classroom Code"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="day_of_week">Day of Week</FormLabel>
                <Autocomplete
                  id="day_of_week"
                  options={daysOfWeek}
                  getOptionLabel={(option) => option}
                  value={formData.day_of_week}
                  onChange={(event, newValue) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      day_of_week: newValue || "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="day_of_week"
                      variant="outlined"
                      placeholder="Select Day of Week"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
          </Grid>
          <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Create Class Schedule
            </Button>
          </Stack>
        </Box>
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
      </Card>
    </CreateClassScheduleFormContainer>
  );
};

export { CreateClassScheduleForm };
