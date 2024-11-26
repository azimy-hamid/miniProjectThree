import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Modal,
  Paper,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getStudentsForTeacher } from "../../../../../services/teacherEndpoints";
import { updateStudentsAcademicHistoryStatus } from "../../../../../services/studentEndpoints";

export default function AllStudentsAcademicHistoryTable({ teacher }) {
  const teacherId = localStorage.getItem("user_id_fk");
  const [students, setStudents] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [modal, setModal] = useState({
    open: false,
    updatedStudents: [],
    notUpdatedStudents: [],
  });

  const currentMonth = new Date().getMonth(); // 0 = January, 11 = December
  const isDecember = currentMonth === 10;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudentsForTeacher(teacherId);
        if (response?.students) {
          const { transformedStudents, dynamicColumns } = transformStudentData(
            response.students
          );
          setStudents(transformedStudents);
          setColumns(dynamicColumns);
        } else {
          console.error("No students found in response.");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [teacherId]);

  const transformStudentData = (students) => {
    const subjects = new Set();

    const transformedStudents = students.map((student) => {
      if (student.subjects) {
        student.subjects.forEach((subject) =>
          subjects.add(subject.subjectCode)
        );
      }

      const hasFailed = student.subjects?.some((sub) =>
        sub.marks?.some((mark) => mark.mark < 70)
      );

      const studentData = {
        studentId: student.studentId,
        student_first_name:
          student.student_first_name || "No Student First Name ",
        student_last_name: student.student_last_name || "No Student Last Name ",
        hasFailed,
        calendarYear: student.calendarYear || new Date().getFullYear(),
      };

      Array.from(subjects).forEach((code) => {
        const subject = student.subjects?.find(
          (sub) => sub.subjectCode === code
        );
        studentData[`subject_${code}`] = subject
          ? `${subject.subjectName || "Unknown Subject"} (${
              subject.marks?.map((mark) => mark.mark).join(", ") || "No Marks"
            })`
          : "No Data";
      });

      return studentData;
    });

    const dynamicColumns = [
      {
        field: "student_first_name",
        headerName: "Student First Name",
        flex: 1,
      },
      { field: "student_last_name", headerName: "Student Last Name", flex: 1 },
      ...Array.from(subjects).map((code) => ({
        field: `subject_${code}`,
        headerName: `Subject (${code})`,
        flex: 1,
      })),
      {
        field: "status",
        headerName: "Status",
        renderCell: renderStatusCell,
        flex: 1,
      },
    ];

    return { transformedStudents, dynamicColumns };
  };

  const renderStatusCell = ({ row }) => {
    const currentChange = pendingChanges.find(
      (change) => change.studentId === row.studentId
    );
    const currentValue =
      currentChange?.hasFailed !== undefined
        ? currentChange.hasFailed
          ? "failed"
          : "passed"
        : row.hasFailed
        ? "failed"
        : "passed";

    return (
      <RadioGroup
        row
        value={currentValue}
        onChange={(e) =>
          handleStatusChange(row.studentId, e.target.value === "failed", row)
        }
      >
        <FormControlLabel
          value="passed"
          control={<Radio />}
          label="Passed"
          disabled={!isDecember}
        />
        <FormControlLabel
          value="failed"
          control={<Radio />}
          label="Failed"
          disabled={!isDecember}
        />
      </RadioGroup>
    );
  };

  const handleStatusChange = (studentId, hasFailed, studentRow) => {
    if (!hasFailed) {
      const failedSubjects = getFailedSubjects(studentRow);
      if (failedSubjects.length > 0) {
        setModal({
          open: true,
          studentName: studentRow.studentName,
          failedSubjects,
        });
        return; // Prevent status change
      }
    }

    setPendingChanges((prev) =>
      prev.some((change) => change.studentId === studentId)
        ? prev.map((change) =>
            change.studentId === studentId ? { ...change, hasFailed } : change
          )
        : [...prev, { studentId, hasFailed }]
    );

    setStudents((prev) =>
      prev.map((student) =>
        student.studentId === studentId ? { ...student, hasFailed } : student
      )
    );
  };

  const getFailedSubjects = (student) => {
    return (
      student.subjects
        ?.filter((subject) => subject.marks?.some((mark) => mark.mark < 60))
        ?.map((subject) => subject.subjectName || "Unknown Subject") || []
    );
  };

  const handleSubmit = async () => {
    const payload = pendingChanges.map(({ studentId, hasFailed }) => ({
      student_id_fk: studentId,
      calendar_year: students.find((s) => s.studentId === studentId)
        .calendarYear,
      status: hasFailed ? "failed" : "passed",
    }));

    try {
      const response = await updateStudentsAcademicHistoryStatus(payload);

      const updatedStudents = response.updatedStudents || [];
      const notUpdatedStudents = response.notUpdatedStudents || [];

      // Open the modal with the results
      setModal({
        open: true,
        updatedStudents,
        notUpdatedStudents,
      });

      if (response?.message) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        setPendingChanges([]);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating student statuses.",
        severity: "error",
      });
      console.error("Error updating student statuses:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleModalClose = () => {
    setModal({ open: false, updatedStudents: [], notUpdatedStudents: [] });
  };

  return (
    <Box sx={{ width: "100%", marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        All Students Academic History
      </Typography>
      <Typography
        variant="body1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        Students must have a score of 60 and above in all subjects to pass.
        Status updates are allowed only once per year and during December.
      </Typography>
      <Box sx={{ height: 500, overflow: "auto" }}>
        <DataGrid
          rows={students}
          columns={columns}
          getRowId={(row) => row.studentId}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!pendingChanges.length || !isDecember}
        sx={{ marginTop: 2 }}
      >
        Submit Changes
      </Button>
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
      <Modal open={modal.open} onClose={handleModalClose}>
        <Paper
          sx={{
            width: 600, // Adjusted width to accommodate both columns
            margin: "auto",
            marginTop: "10%",
            padding: 4,
            outline: "none",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Just Updated Students:
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <ul>
                {modal.updatedStudents.map((student, index) => (
                  <li key={index}>
                    {student.student_id_fk} - {student.status}
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>
                Already Updated Students:
              </Typography>
              <ul>
                {modal.notUpdatedStudents.map((student, index) => (
                  <li key={index}>
                    {student.student_first_name} {student.student_last_name} -{" "}
                    {student.calendar_year}
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleModalClose}
            sx={{ marginTop: 2 }}
          >
            Close
          </Button>
        </Paper>
      </Modal>{" "}
    </Box>
  );
}
