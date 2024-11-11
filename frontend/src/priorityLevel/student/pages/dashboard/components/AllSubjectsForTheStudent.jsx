import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { getSubjectsForStudent } from "../../../../../services/subjectEndpoints.js";

export default function AllSubjectsForTheStudentTable({ student }) {
  const [subjects, setSubjects] = useState([]);
  const studentId = localStorage.getItem("user_id_fk");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the assigned subjects for the selected student
        const response = await getSubjectsForStudent(studentId);

        // Check if subjects are in response
        if (response && response.subjects) {
          setSubjects(response.subjects);
        } else {
          console.error("No subjects found in response.");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchData();
  }, [studentId]);

  const columns = [
    {
      field: "subject_code",
      headerName: "Subject Code",
      flex: 1,
      valueGetter: (value, row) => row.subject.subject_code,
    },
    {
      field: "subject_name",
      headerName: "Subject Name",
      flex: 1,
      valueGetter: (value, row) => row.subject.subject_name,
    },
    {
      field: "teacher",
      headerName: "Teacher",
      flex: 1,
      renderCell: (params) => {
        // Ensure that the teacher's details exist
        if (
          !params.row.subject.Teachers ||
          params.row.subject.Teachers.length === 0
        ) {
          return <Typography>No teacher assigned</Typography>;
        }

        const teacher = params.row.subject.Teachers[0]; // Assuming one teacher per subject
        return (
          <Typography>{`${teacher.teacher_first_name} ${teacher.teacher_last_name}`}</Typography>
        );
      },
    },
    {
      field: "classroom_code",
      headerName: "Classroom",
      flex: 1,
      valueGetter: (value, row) =>
        row.subject.classroom?.classroom_code || "N/A",
    },
    {
      field: "capacity",
      headerName: "Capacity",
      flex: 1,
      valueGetter: (value, row) => row.subject.classroom?.capacity || "N/A",
    },
    {
      field: "room_type",
      headerName: "Room Type",
      flex: 1,
      valueGetter: (value, row) => row.subject.classroom?.room_type || "N/A",
    },
    {
      field: "section",
      headerName: "Section",
      flex: 1,
      valueGetter: (value, row) => row.subject.section || "N/A",
    },

    {
      field: "marks",
      headerName: "Marks",
      flex: 1,
      valueGetter: (value, row) => row.subject.marks[0].subject_mark || "N/A",
    },

    // {
    //   field: "details",
    //   headerName: "Details",
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       onClick={() =>
    //         navigate(
    //           `/student/subject-details/${params.row.subject.subject_id_pk}`
    //         )
    //       }
    //     >
    //       View Details
    //     </Button>
    //   ),
    // },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", marginTop: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        {`Subjects ${student.student_first_name} ${student.student_last_name} is enrolled in`}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        Detailed information about assigned subjects, classrooms, and teachers.
      </Typography>
      <DataGrid
        rows={subjects}
        columns={columns}
        getRowId={(row) => row.subject.subject_id_pk}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight
      />
    </Box>
  );
}
