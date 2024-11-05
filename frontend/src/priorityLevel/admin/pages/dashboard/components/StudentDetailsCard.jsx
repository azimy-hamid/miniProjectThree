import * as React from "react";
import { Card as MuiCard, CardContent, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up("sm")]: {
    maxWidth: "600px",
  },
}));

const StudentDetailsCard = ({ student }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4" sx={{ color: "primary.main" }}>
          Student Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Student Code:</strong> {student.student_code || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>First Name:</strong> {student.student_first_name || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Last Name:</strong> {student.student_last_name || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Gender:</strong> {student.gender || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Date of Birth:</strong>{" "}
              {new Date(student.dob).toLocaleDateString() || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Email:</strong> {student.email || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Phone:</strong> {student.phone || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Join Date:</strong>{" "}
              {new Date(student.join_date).toLocaleDateString() || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Grade Code:</strong> {student.Grade?.grade_code || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Semester Number:</strong>{" "}
              {student.Semester?.semester_number || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StudentDetailsCard;
