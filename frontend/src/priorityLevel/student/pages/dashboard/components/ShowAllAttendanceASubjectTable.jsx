import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { getStudentAttendanceGroupedBySubject } from "../../../../../services/attendanceEndpoints";

export default function ShowAllAttendanceASubjectTable({ subject }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const userId = localStorage.getItem("user_id_fk");
        if (!userId) {
          throw new Error("User ID not found in local storage.");
        }

        const response = await getStudentAttendanceGroupedBySubject(userId);
        if (
          response?.groupedAttendance &&
          response.groupedAttendance[subject.subject_code]
        ) {
          const attendanceData =
            response.groupedAttendance[subject.subject_code].attendance;
          setAttendanceRecords(attendanceData);
        } else {
          setAttendanceRecords([]);
          console.error(
            "Attendance data not found for subject:",
            subject.subject_code
          );
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setSnackbar({
          open: true,
          message: "Error fetching attendance data.",
          severity: "error",
        });
      }
    };

    fetchAttendance();
  }, [subject.subject_code]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueGetter: (value, row) => new Date(row.date).toLocaleDateString(),
    },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "reason", headerName: "Reason", flex: 2 },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", marginTop: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Attendance for {subject.subjectName} ({subject.subject_code})
      </Typography>

      <DataGrid
        rows={attendanceRecords}
        columns={columns}
        getRowId={(row) => row.date}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
