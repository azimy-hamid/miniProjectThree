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

const SubjectDetailsCard = ({ subject }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4" sx={{ color: "primary.main" }}>
          Subject Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Subject Code:</strong> {subject.subject_code || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Subject Name:</strong> {subject.subject_name || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Section:</strong> {subject.section || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Classroom Code:</strong>
              {subject.classroom ? subject.classroom.classroom_code : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Capacity:</strong>
              {subject.classroom ? subject.classroom.capacity : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Room Type:</strong>
              {subject.classroom ? subject.classroom.room_type : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Room Description:</strong>
              {subject.classroom ? subject.classroom.description : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Grade Level:</strong>
              {subject.Grade ? subject.Grade.grade_level : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Grade Code:</strong>
              {subject.Grade ? subject.Grade.grade_code : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Semester Number:</strong>
              {subject.Semester ? subject.Semester.semester_number : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SubjectDetailsCard;
