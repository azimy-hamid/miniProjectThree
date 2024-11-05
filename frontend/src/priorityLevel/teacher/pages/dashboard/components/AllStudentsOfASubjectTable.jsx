import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Modal, Paper, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import { getStudentsForSubject } from "../../../../../services/subjectEndpoints";
import { getSpecificStudent } from "../../../../../services/studentEndpoints";

export default function AllStudentsOfASubjectTable({ subject }) {
  const { subjectId } = useParams();
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const columns = [
    { field: "student_id_pk", headerName: "Student ID", flex: 1 },
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

                <Grid item xs={6}>
                  <Typography variant="body2">Gender:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {selectedStudent.gender}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">DOB:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {new Date(selectedStudent.dob).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">Email:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {selectedStudent.email}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">Phone:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {selectedStudent.phone}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">Join Date:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {new Date(selectedStudent.join_date).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">Grade:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {selectedStudent.Grade.grade_code}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">Semester:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {selectedStudent.Semester.semester_number}
                  </Typography>
                </Grid>
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
    </Box>
  );
}
