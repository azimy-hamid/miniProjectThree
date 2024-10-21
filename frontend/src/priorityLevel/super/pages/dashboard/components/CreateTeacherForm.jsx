import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { createAdmin } from "../../../../../services/adminEndpoints.js"; // Ensure the path is correct

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

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  marginTop: theme.spacing(18),
}));

export default function CreateAdmin(props) {
  const [formData, setFormData] = React.useState({
    teacher_first_name: "",
    teacher_last_name: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    join_date: "",
    working_days: "",
  });

  const [errors, setErrors] = React.useState({});

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
      "teacher_first_name",
      "teacher_last_name",
      "gender",
      "dob",
      "email",
      "working_days",
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
    const isValid = validateInputs();
    if (!isValid) return;

    try {
      const data = await createAdmin(formData); // Send the complete formData
      console.log("Admin created successfully:", data);
      // Handle successful creation (e.g., redirect or show a success message)
    } catch (error) {
      const errorMsg =
        error.response?.data?.createAdminMessage ||
        "Admin creation failed. Please try again.";
      console.error("Admin creation failed:", errorMsg);
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography component="h1" variant="h4">
          Create Admin
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
          {Object.keys(formData).map((key) => (
            <FormControl key={key}>
              <FormLabel htmlFor={key}>{key.replace(/_/g, " ")}</FormLabel>
              <TextField
                error={!!errors[key]}
                helperText={errors[key]}
                id={key}
                name={key}
                type={key === "dob" ? "date" : "text"}
                value={formData[key]}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
          ))}
          <Stack direction="column" spacing={1}>
            <Button type="submit" variant="contained">
              Create Admin
            </Button>
          </Stack>
        </Box>
      </Card>
    </SignInContainer>
  );
}
