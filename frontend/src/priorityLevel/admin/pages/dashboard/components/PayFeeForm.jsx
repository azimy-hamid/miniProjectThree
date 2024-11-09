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
import { payFee } from "../../../../../services/feesEndpoints.js";
import { getAllStudentCodes } from "../../../../../services/studentEndpoints.js";
import { getAllSemestersNumbers } from "../../../../../services/semesterEndpoints.js";

const Card = styled(MuiCard)(({ theme }) => ({
  margin: "auto",
  padding: theme.spacing(4),
  maxWidth: "450px",
}));

const PayFeeFormContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export default function PayFeeForm({ student }) {
  const [studentCodes, setStudentCodes] = React.useState([]);
  const [semesterNumbers, setSemesterNumbers] = React.useState([]);
  const [errors, setErrors] = React.useState({});
  const [successMessage, setSuccessMessage] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await getAllStudentCodes();
        setStudentCodes(studentsResponse.codesArray);
        const semestersResponse = await getAllSemestersNumbers();
        setSemesterNumbers(semestersResponse.semesterNumbers);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const [formData, setFormData] = React.useState({
    student_code: student?.student_code || studentCodes, // Initialize student_code from prop
    fee_type: "",
    fee_amount: "",
    due_date: "",
    payment_status: "",
    payment_date: "",
    penalty: "",
    discounts: "",
    payment_mode: "",
    semester: "",
  });

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
      "student_code",
      "fee_type",
      "fee_amount",
      "due_date",
      "semester",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    if (formData.fee_amount && isNaN(formData.fee_amount)) {
      newErrors.fee_amount = "Amount must be a valid number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      const response = await payFee(formData);
      if (response.success) {
        setSuccessMessage("Fee payment successful!");
        setFormData({
          student_code: "", // Reset the form
          fee_type: "",
          fee_amount: "",
          due_date: "",
          payment_status: "",
          payment_date: "",
          penalty: "",
          discounts: "",
          payment_mode: "",
          semester: "",
        });
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || "Fee payment failed.",
      });
    }
  };

  return (
    <PayFeeFormContainer direction="column" justifyContent="center">
      <Card variant="outlined">
        <Typography component="h1" variant="h4">
          Pay Fees
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="student_code">Student Code</FormLabel>
                {student?.student_code ? (
                  // Show a non-editable TextField if student_code is provided as a prop
                  <TextField
                    id="student_code"
                    name="student_code"
                    value={student.student_code}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                ) : (
                  // Show a Select dropdown if no student_code prop is provided
                  <Select
                    id="student_code"
                    name="student_code"
                    value={formData.student_code}
                    onChange={handleChange}
                    error={!!errors.student_code}
                    displayEmpty
                  >
                    <MenuItem value="">Select Student Code</MenuItem>
                    {studentCodes.map((code) => (
                      <MenuItem key={code} value={code}>
                        {code}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                <Typography variant="caption" color="error">
                  {errors.student_code}
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="fee_type">Fee Type</FormLabel>
                <TextField
                  id="fee_type"
                  name="fee_type"
                  value={formData.fee_type}
                  onChange={handleChange}
                  error={!!errors.fee_type}
                  helperText={errors.fee_type}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="fee_amount">Amount</FormLabel>
                <TextField
                  id="fee_amount"
                  name="fee_amount"
                  type="number"
                  value={formData.fee_amount}
                  onChange={handleChange}
                  error={!!errors.fee_amount}
                  helperText={errors.fee_amount}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="due_date">Due Date</FormLabel>
                <TextField
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                  error={!!errors.due_date}
                  helperText={errors.due_date}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="semester">Semester</FormLabel>
                <Select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  error={!!errors.semester}
                  displayEmpty
                >
                  <MenuItem value="">Select Semester</MenuItem>
                  {semesterNumbers.map((number) => (
                    <MenuItem key={number} value={number}>
                      {number}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="error">
                  {errors.semester}
                </Typography>
              </FormControl>
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" fullWidth>
            Pay Fee
          </Button>
        </Box>
        {errors.general && (
          <Typography variant="body2" color="error" align="center">
            {errors.general}
          </Typography>
        )}
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={successMessage}
      />
    </PayFeeFormContainer>
  );
}
