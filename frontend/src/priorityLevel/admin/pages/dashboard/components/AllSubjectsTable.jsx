import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  getAllSubject,
  deleteSubject,
} from "../../../../../services/subjectEndpoints";
import { useNavigate } from "react-router-dom";

export default function AllSubjectsTable() {
  const [subjects, setSubjects] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success", "error", etc.
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getAllSubject();
        setSubjects(data.subjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleDetailsClick = (subjectId) => {
    navigate(`/admin/subject-details/${subjectId}`);
  };

  const handleDeleteClick = async (subjectId) => {
    try {
      const deletedSubject = await deleteSubject(subjectId);
      console.log(deleteSubject);

      if (deletedSubject.deleteSubjectMessage) {
        setSnackbarMessage(deletedSubject.deleteSubjectMessage);
        setSnackbarSeverity(deletedSubject.deleteSubjectMessage);

        // Remove the subject from the list after deletion
        setSubjects((prevSubjects) =>
          prevSubjects.filter((subject) => subject.subject_id_pk !== subjectId)
        );
      } else {
        setSnackbarMessage(deletedSubject.deleteSubjectMessage);
        setSnackbarSeverity("error");
      }

      // Open the snackbar
      setSnackbarOpen(true);
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.deleteSubjectMessage
          ? error.response.data.deleteSubjectMessage
          : "Server error. Please try again later.";

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const columns = [
    {
      field: "subject_code",
      headerName: "Subject Code",
      flex: 1,
      valueGetter: (value, row) => row?.subject_code || "N/A",
    },
    {
      field: "subject_name",
      headerName: "Subject Name",
      flex: 1,
      valueGetter: (value, row) => row?.subject_name || "N/A",
    },
    {
      field: "section",
      headerName: "Section",
      flex: 1,
      valueGetter: (value, row) => row?.section || "N/A",
    },
    {
      field: "classroom_id_fk",
      headerName: "Classroom ID",
      flex: 1,
      valueGetter: (value, row) => row?.classroom?.classroom_code || "N/A",
    },
    {
      field: "grade_id_fk",
      headerName: "Grade Level",
      flex: 1,
      valueGetter: (value, row) => row?.Grade?.grade_level || "N/A", // Assuming you want to display the grade level
    },
    {
      field: "semester_id_fk",
      headerName: "Semester",
      flex: 1,
      valueGetter: (value, row) => row?.Semester?.semester_number || "N/A", // Assuming you want to display the semester number
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleDetailsClick(params.row.subject_id_pk)}
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
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleDeleteClick(params.row.subject_id_pk)}
        >
          Delete Subject
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", marginTop: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Subjects Directory
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        A comprehensive list of all registered subjects.
      </Typography>
      <DataGrid
        rows={subjects}
        columns={columns}
        getRowId={(row) => row.subject_id_pk}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight={false}
      />

      {/* Snackbar for feedback */}
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
