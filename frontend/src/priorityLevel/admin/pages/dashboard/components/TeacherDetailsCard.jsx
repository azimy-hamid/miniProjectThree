import * as React from "react";
import {
  Box,
  Card as MuiCard,
  CardContent,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
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

const TeacherDetailsCard = ({ teacher }) => {
  // Split the working_days string into an array
  const workingDaysArray = teacher.working_days.split(",");

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4" sx={{ color: "primary.main" }}>
          {`${teacher.teacher_first_name} ${teacher.teacher_last_name}`}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Gender:</strong> {teacher.gender}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Date of Birth:</strong>{" "}
              {teacher.dob ? teacher.dob.split("T")[0] : ""}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Email:</strong> {teacher.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Phone:</strong> {teacher.phone}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Join Date:</strong>{" "}
              {teacher.join_date ? teacher.join_date.split("T")[0] : ""}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Working Days:</strong>
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {workingDaysArray.map((day) => (
                <Chip
                  key={day.trim()} // Use day.trim() to handle any extra spaces
                  label={
                    day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
                  } // Capitalize first letter and lower the rest
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TeacherDetailsCard;
