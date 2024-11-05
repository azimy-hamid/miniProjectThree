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

import { styled } from "@mui/material/styles";
import { createClassroom } from "../../../../../services/classroomEndpoints";

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

const CreateClassroomFormContainer = styled(Stack)(({ theme }) => ({
  // minHeight: "100%",
  // padding: theme.spacing(2),
  // marginTop: theme.spacing(18),
}));

export default function CreateClassroomForm() {
  const [formData, setFormData] = React.useState({
    capacity: "",
    room_type: "",
    description: "",
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
    const requiredFields = ["capacity", "room_type"];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      const classroomResponse = await createClassroom({
        capacity: formData.capacity,
        room_type: formData.room_type,
        description: formData.description || null,
      });

      if (classroomResponse?.newClassroom) {
        setGeneralError("");
        setSuccessMessage("Classroom created successfully!");
        setFormData({
          capacity: "",
          room_type: "",
          description: "",
        });
        setOpenSnackbar(true);
      }
    } catch (error) {
      setGeneralError(
        error.response?.createClassroomMessage || "Failed to create classroom."
      );
    }
  };

  return (
    <CreateClassroomFormContainer
      direction="column"
      justifyContent="space-between"
    >
      <Card variant="outlined">
        <Typography component="h1" variant="h4">
          Create Classroom
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
                <FormLabel htmlFor="capacity">Capacity</FormLabel>
                <TextField
                  error={!!errors.capacity}
                  helperText={errors.capacity}
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="room_type">Room Type</FormLabel>
                <Select
                  id="room_type"
                  name="room_type"
                  value={formData.room_type}
                  onChange={handleChange}
                  error={!!errors.room_type}
                  displayEmpty
                >
                  <MenuItem value="">Select room type</MenuItem>
                  <MenuItem value="lecture hall">Lecture Hall</MenuItem>
                  <MenuItem value="laboratory">Laboratory</MenuItem>
                  <MenuItem value="computer lab">Computer Lab</MenuItem>
                  <MenuItem value="library">Library</MenuItem>
                  <MenuItem value="art room">Art Room</MenuItem>
                  <MenuItem value="music room">Music Room</MenuItem>
                  <MenuItem value="study hall">Study Hall</MenuItem>
                </Select>
                <Typography variant="caption" color="error">
                  {errors.room_type}
                </Typography>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="description">Description</FormLabel>
                <TextField
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  multiline
                />
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
              Create Classroom
            </Button>
          </Stack>
        </Box>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={successMessage}
      />
    </CreateClassroomFormContainer>
  );
}
