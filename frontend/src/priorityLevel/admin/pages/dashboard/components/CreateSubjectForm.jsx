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
import { createSubject } from "../../../../../services/subjectEndpoints";
import { getAllClassroomCodes } from "../../../../../services/classroomEndpoints";

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

const CreateSubjectFormContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  marginTop: theme.spacing(18),
}));

const CreateSubjectForm = () => {
  const [formData, setFormData] = useState({
    subject_name: "",
    classroom_code: "",
    section: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [classroomCodes, setClassroomCodes] = useState([]); // Holds classroom codes

  // Fetch classroom codes on component mount
  useEffect(() => {
    const fetchClassroomCodes = async () => {
      try {
        const classroomCodes = await getAllClassroomCodes();
        setClassroomCodes(classroomCodes); // Update with the list of classroom codes
      } catch (error) {
        console.error("Failed to fetch classroom codes", error);
      }
    };
    fetchClassroomCodes();
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
    const { subject_name, classroom_code } = formData;

    if (!subject_name || !classroom_code) {
      setNotification({
        open: true,
        message: "Subject Name and Classroom ID are required.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await createSubject(formData);
      setNotification({
        open: true,
        message: response.createSubjectMessage,
        severity: "success",
      });
      setFormData({ subject_name: "", classroom_code: "", section: "" }); // Clear form
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to create subject. Please try again.",
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="classroom_code">Classroom ID</FormLabel>
                <Autocomplete
                  id="classroom_code"
                  options={classroomCodes}
                  getOptionLabel={(option) => option} // Replace `code` with the appropriate field in the classroom codes
                  value={formData.classroom_code}
                  onChange={(event, newValue) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      classroom_code: newValue ? newValue : "", // Use classroom code
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="classroom_code"
                      variant="outlined"
                      placeholder="Search Classroom ID"
                    />
                  )}
                  isOptionEqualToValue={
                    (option, value) => option.code === value // Adjust field as needed
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
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
          </Grid>

          <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Create Subject
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
    </CreateSubjectFormContainer>
  );
};

export { CreateSubjectForm };
