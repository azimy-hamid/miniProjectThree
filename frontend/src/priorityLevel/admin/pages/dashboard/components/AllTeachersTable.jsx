import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllTeachers } from "../../../../../services/teacherEndpoints.js";
import { useNavigate } from "react-router-dom";
import { deleteTeacher } from "../../../../../services/teacherEndpoints.js";

export default function AllTeachersTable() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    getAllTeachers()
      .then((data) => {
        setTeachers(data);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  }, []);

  const handleDetailsClick = (teacherId) => {
    navigate(`/admin/teacher-details/${teacherId}`);
  };

  const handleDeleteClick = async (teacherId) => {
    try {
      const deletedTeacher = await deleteTeacher(teacherId);
      console.log(deletedTeacher);

      if (deletedSubject.deletedTeacherMessage) {
        setSnackbarMessage(deletedSubject.deleteTeacherMessage);
        setSnackbarSeverity(deletedSubject.deleteTeacherMessage);

        // Remove the subject from the list after deletion
        setSubjects((prevSubjects) =>
          prevSubjects.filter((subject) => subject.subject_id_pk !== teacherId)
        );
      } else {
        setSnackbarMessage(deletedSubject.deleteTeacherMessage);
        setSnackbarSeverity("error");
      }

      // Open the snackbar
      setSnackbarOpen(true);
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.deleteTeacherMessage
          ? error.response.data.deleteTeacherMessage
          : "Server error. Please try again later.";

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const columns = [
    { field: "teacher_first_name", headerName: "First Name", flex: 1 },
    { field: "teacher_last_name", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "working_days", headerName: "Working Days", flex: 2 },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleDetailsClick(params.row.teacher_id_pk)}
        >
          Details
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1.5,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleDeleteClick(params.row.teacher_id_pk)}
        >
          Delete Teacher
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", marginTop: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Teacher Directory
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        A comprehensive list of all registered teachers.
      </Typography>
      <DataGrid
        rows={teachers}
        columns={columns}
        getRowId={(row) => row.teacher_id_pk}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight={false}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
