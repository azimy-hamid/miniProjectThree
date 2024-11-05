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

const ClassroomDetailsCard = ({ classroom }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4" sx={{ color: "primary.main" }}>
          Classroom Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Classroom Code:</strong> {classroom.classroom_code}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Capacity:</strong> {classroom.capacity}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Room Type:</strong> {classroom.room_type}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Description:</strong> {classroom.description || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ClassroomDetailsCard;
