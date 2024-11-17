import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Checkbox,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import { getStudentsForSubject } from "../../../../../services/subjectEndpoints";
import { markAttendanceForASubject } from "../../../../../services/attendanceEndpoints";

export default function MarkStudentAttendanceTable({ subject }) {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [attendanceReason, setAttendanceReason] = useState({});
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

  const handleStatusChange = (studentId, value) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: value,
    }));
    if (value === "present") {
      setAttendanceReason((prev) => ({
        ...prev,
        [studentId]: "", // Clear reason if status is "present"
      }));
    }
  };

  const handleReasonChange = (studentId, value) => {
    setAttendanceReason((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSubmitAttendance = async () => {
    const attendanceData = selectedStudentIds.map((studentId) => ({
      student_ids_fk: studentId,
      subject_id_fk: subjectId,
      attendance_date: new Date().toISOString().split("T")[0], // Current date
      attendance_status: attendanceStatus[studentId] || "present", // Default to "present"
      reason: attendanceReason[studentId] || "", // Default to an empty string
    }));

    console.log(attendanceData); // Debugging: Ensure the payload is accurate

    try {
      const response = await markAttendanceForASubject(attendanceData);
      setSnackbar({
        open: true,
        message: response.message || "Attendance marked successfully!",
        severity: "success",
      });
      setSelectedStudentIds([]);
      setAttendanceStatus({});
      setAttendanceReason({});
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          "Error marking attendance: " +
          (error.response?.data?.createAttendanceMessage || error.message),
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
      field: "attendance_status",
      headerName: "Attendance Status",
      flex: 1,
      renderCell: (params) => {
        const studentId = params.row.student_id_pk;
        return (
          <FormControl fullWidth size="small">
            <Select
              value={attendanceStatus[studentId] || "present"}
              onChange={(e) => handleStatusChange(studentId, e.target.value)}
              label="Attendance Status"
            >
              <MenuItem value="present">Present</MenuItem>
              <MenuItem value="absent">Absent</MenuItem>
              <MenuItem value="late">Late</MenuItem>
              <MenuItem value="excused">Excused</MenuItem>
            </Select>
          </FormControl>
        );
      },
    },
    {
      field: "attendance_reason",
      headerName: "Reason",
      flex: 1,
      renderCell: (params) => {
        const studentId = params.row.student_id_pk;
        return (
          attendanceStatus[studentId] !== "present" && (
            <TextField
              fullWidth
              label="Reason"
              variant="outlined"
              size="small"
              value={attendanceReason[studentId] || ""}
              onChange={(e) => handleReasonChange(studentId, e.target.value)}
              sx={{ mt: 1 }}
              required
            />
          )
        );
      },
    },

    {
      field: "details",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            navigate(
              `/teacher/attendance-details/${subject.subject_id_pk}/${params.row.student_id_pk}`
            )
          }
        >
          View Student's Attendance
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
        variant="outlined"
        color="primary"
        sx={{ mt: 2, mr: 2 }}
        onClick={handleSubmitAttendance}
        disabled={selectedStudentIds.length === 0} // Disable attendance button when no students are selected
      >
        Mark Attendance
      </Button>

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
