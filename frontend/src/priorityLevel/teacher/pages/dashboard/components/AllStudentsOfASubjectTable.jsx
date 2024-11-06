import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Paper,
  Grid,
  Snackbar,
  Alert,
  Checkbox,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import { getStudentsForSubject } from "../../../../../services/subjectEndpoints";
import { getSpecificStudent } from "../../../../../services/studentEndpoints";
import { markAttendanceForASubject } from "../../../../../services/attendanceEndpoints";

export default function AllStudentsOfASubjectTable({ subject }) {
  const { subjectId } = useParams();
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStudentsForSubject(subjectId);

        if (response && response.students) {
          setStudents(response.students);
          setStudentCount(response.student_count);
        } else {
          console.error("No students found in response.");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchData();
  }, [subjectId]);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleOpenModal = async (studentId) => {
    try {
      const studentDetails = await getSpecificStudent(studentId);
      setSelectedStudent(studentDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSubmitAttendance = async () => {
    const attendanceData = {
      student_ids_fk: selectedStudentIds,
      subject_id_fk: subjectId,
      attendance_date: new Date().toISOString().split("T")[0], // default to today
      attendance_status: "present", // set a default status
      reason: "", // default reason can be empty
    };

    try {
      await markAttendanceForASubject(attendanceData);
      setSnackbar({
        open: true,
        message: "Attendance marked successfully!",
        severity: "success",
      });
      setSelectedStudentIds([]); // Clear selected students after submission
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          "Error marking attendance: " +
          error.response.data.createAttendanceMessage,
        severity: "error",
      });
      console.error("Error marking attendance:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    {
      field: "select",
      headerName: "Select",
      width: 80,
      renderCell: (params) => (
        <Checkbox
          checked={selectedStudentIds.includes(params.row.student_id_pk)}
          onChange={() => handleCheckboxChange(params.row.student_id_pk)}
        />
      ),
    },
    { field: "student_code", headerName: "Student Code", flex: 1 },
    { field: "student_first_name", headerName: "First Name", flex: 1 },
    { field: "student_last_name", headerName: "Last Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal(params.row.student_id_pk)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", marginTop: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        {`Students Enrolled in ${subject.subject_name}: ${subject.subject_code}`}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        {`Total students enrolled: ${studentCount}`}
      </Typography>
      <DataGrid
        rows={students}
        columns={columns}
        getRowId={(row) => row.student_id_pk}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSubmitAttendance}
        disabled={selectedStudentIds.length === 0}
      >
        Mark Attendance
      </Button>

      {/* Modal for displaying student details */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            p: 4,
          }}
        >
          {selectedStudent ? (
            <Box>
              <Typography variant="h5" gutterBottom>
                Student Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Name:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {selectedStudent.student_first_name}{" "}
                    {selectedStudent.student_last_name}
                  </Typography>
                </Grid>

                {/* Additional student details */}
                {/* Render more fields as needed */}
              </Grid>
              <Button
                onClick={handleCloseModal}
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                Close
              </Button>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Paper>
      </Modal>

      {/* Snackbar for success and error messages */}
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
