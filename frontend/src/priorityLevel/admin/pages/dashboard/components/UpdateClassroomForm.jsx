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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { updateClassroom } from "../../../../../services/classroomEndpoints";

const Card = styled(MuiCard)(({ theme }) => ({
  padding: theme.spacing(4),
  gap: theme.spacing(2),
}));

const CreateClassroomFormContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
}));

export default function UpdateClassroomForm({ classroom }) {
  const { classroomId } = useParams();
  const [formData, setFormData] = React.useState({
    capacity: classroom?.capacity || "",
    room_type: classroom?.room_type || "",
    description: classroom?.description || "",
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
      const classroomResponse = await updateClassroom(
        {
          capacity: formData.capacity,
          room_type: formData.room_type,
          description: formData.description || null,
        },
        classroomId
      );

      if (classroomResponse?.updateClassroomMessage) {
        setGeneralError("");
        setSuccessMessage("Classroom updated successfully!");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setGeneralError(
        error.response?.data?.updateClassroomMessage ||
          "Failed to update classroom."
      );
    }
  };

  return (
    <CreateClassroomFormContainer
      direction="column"
      justifyContent="space-between"
    >
      <Card variant="outlined">
        <Typography variant="h4" sx={{ color: "primary.main" }}>
          Update {`${classroom.classroom_code}`}
        </Typography>{" "}
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
                  rows={3}
                  fullWidth
                  variant="outlined"
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
              Update Classroom
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
    </CreateClassroomFormContainer>
  );
}
