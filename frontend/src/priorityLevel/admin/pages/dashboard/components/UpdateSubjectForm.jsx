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
import { updateSubject } from "../../../../../services/subjectEndpoints";
import { getAllClassroomCodes } from "../../../../../services/classroomEndpoints";
import { getAllSemestersNumbers } from "../../../../../services/semesterEndpoints";
import { getAllGradeCodes } from "../../../../../services/gradeEndpoints";
import { getAllTeacherCodes } from "../../../../../services/teacherEndpoints";

const Card = styled(MuiCard)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const UpdateSubjectFormContainer = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  padding: theme.spacing(4),
}));

const UpdateSubjectForm = ({ subject }) => {
  const [formData, setFormData] = useState({
    subject_name: subject?.subject_name || "",
    classroom_code: subject?.classroom.classroom_code || "",
    semester_number: subject?.Semester.semester_number || "",
    section: subject?.section || "",
    grade_code: subject?.Grade?.grade_code || "",
    day_of_week: subject?.schedules
      ? subject.schedules.map((schedule) => schedule.day_of_week)
      : [],
    start_time: subject?.schedules ? subject?.schedules[0]?.start_time : "", // Assuming the first schedule is representative
    end_time: subject?.schedules ? subject?.schedules[0]?.end_time : "",
    teacher_code: subject?.Teachers[0]?.teacher_code || "", // Adjust according to your data structure
  });

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [classroomCodes, setClassroomCodes] = useState([]);
  const [semesterNumbers, setSemesterNumbers] = useState([]);
  const [gradeCodes, setGradeCodes] = useState([]);
  const [teacherCodes, setTeacherCodes] = useState([]);
  const [selectedDays, setSelectedDays] = useState(formData.day_of_week);

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
          getAllTeacherCodes(),
        ]);
        setClassroomCodes(classroomCodes);
        setSemesterNumbers(semesterNumbers);
        setGradeCodes(gradeCodes);
        setTeacherCodes(teacherCodes);

        setSelectedDays(formData.day_of_week);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const handleDayChange = (event) => {
    const { value } = event.target;
    setSelectedDays((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((day) => day !== value)
        : [...prevSelected, value]
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
    const formDataWithDays = { ...formData, day_of_week: daysOfWeekString };

    try {
      const response = await updateSubject(
        formDataWithDays,
        subject.subject_id_pk
      ); // Use the subject_id_pk for updating
      setNotification({
        open: true,
        message: response.updateSubjectMessage,
        severity: "success",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.updateSubjectMessage ||
        "Failed to update subject. Please try again.";
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
    <UpdateSubjectFormContainer>
      <Card variant="outlined">
        <Typography component="h1" variant="h4">
          Update Subject
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
            {/* Subject Name */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Subject Name</FormLabel>
                <TextField
                  name="subject_name"
                  value={formData.subject_name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            {/* Classroom Code */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Classroom Code</FormLabel>
                <Autocomplete
                  options={classroomCodes}
                  getOptionLabel={(option) => option || ""}
                  value={formData.classroom_code}
                  onChange={(event, newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      classroom_code: newValue,
                    }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Semester Number */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Semester Number</FormLabel>
                <Autocomplete
                  options={semesterNumbers}
                  getOptionLabel={(option) => option.toString()}
                  value={formData.semester_number}
                  onChange={(event, newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      semester_number: newValue,
                    }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Section */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Section</FormLabel>
                <TextField
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            {/* Grade Code */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Grade Code</FormLabel>
                <Autocomplete
                  options={gradeCodes}
                  getOptionLabel={(option) => option || ""}
                  value={formData.grade_code}
                  onChange={(event, newValue) =>
                    setFormData((prev) => ({ ...prev, grade_code: newValue }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Days of the Week */}
            <Grid item xs={12}>
              <FormLabel>Days of the Week</FormLabel>
              <FormControl fullWidth>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                  (day) => (
                    <FormControlLabel
                      key={day}
                      control={
                        <Checkbox
                          checked={selectedDays.includes(day.toLowerCase())}
                          onChange={handleDayChange}
                          value={day.toLowerCase()}
                        />
                      }
                      label={day}
                    />
                  )
                )}
              </FormControl>
            </Grid>

            {/* Start Time */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Start Time</FormLabel>
                <TextField
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  type="time"
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            {/* End Time */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>End Time</FormLabel>
                <TextField
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  type="time"
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            {/* Teacher Code */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Teacher Code</FormLabel>
                <Autocomplete
                  options={teacherCodes}
                  getOptionLabel={(option) => option || ""}
                  value={formData.teacher_code}
                  onChange={(event, newValue) =>
                    setFormData((prev) => ({ ...prev, teacher_code: newValue }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Button variant="contained" type="submit">
            Update Subject
          </Button>
        </Box>
      </Card>

      {/* Notification Snackbar */}
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
    </UpdateSubjectFormContainer>
  );
};

export { UpdateSubjectForm };
