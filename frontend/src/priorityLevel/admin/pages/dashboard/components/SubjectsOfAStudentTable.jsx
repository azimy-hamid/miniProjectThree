import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getStudentSubjects } from "../../../../../services/studentEndpoints";
import { useNavigate, useParams } from "react-router-dom";

export default function SubjectsOfAStudentTable({ student }) {
  const { studentId } = useParams();
  const [studentSubjects, setStudentSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentSubjects = async () => {
      try {
        const data = await getStudentSubjects(studentId);
        if (data && data.studentSubjects.subjects) {
          setStudentSubjects(data.studentSubjects.subjects);
        } else {
          console.error("No student subjects found or invalid data structure");
          setStudentSubjects([]); // Optionally reset to an empty array if no subjects found
        }
      } catch (error) {
        console.error("Error fetching student subjects:", error);
      }
    };

    fetchStudentSubjects();
  }, [studentId]); // Re-fetch when studentId changes

  const columns = [
    {
      field: "subject_code",
      headerName: "Subject Code",
      flex: 1,
      valueGetter: (value, row) => row.subject_code || "N/A",
    },
    {
      field: "subject_name",
      headerName: "Subject Name",
      flex: 1,
      valueGetter: (value, row) => row.subject_name || "N/A",
    },
    {
      field: "teacher_names",
      headerName: "Teacher(s)",
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.row.Teachers.length > 0
            ? params.row.Teachers.map(
                (teacher) =>
                  `${teacher.teacher_first_name} ${teacher.teacher_last_name}`
              ).join(", ")
            : "N/A"}
        </span>
      ),
    },
    {
      field: "schedules",
      headerName: "Schedules",
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.row.schedules.length > 0
            ? params.row.schedules.map((schedule, index) => (
                <div key={index}>
                  {schedule.day_of_week}: {schedule.start_time} -{" "}
                  {schedule.end_time}
                </div>
              ))
            : "N/A"}
        </span>
      ),
    },
    {
      field: "classroom_code",
      headerName: "Classroom Code",
      flex: 1,
      renderCell: (params) => {
        const classrooms = params.row.schedules
          .map((schedule) => schedule.classroom?.classroom_code)
          .filter(Boolean);
        return classrooms.length > 0 ? classrooms.join(", ") : "N/A";
      },
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", marginTop: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        {`${student.student_first_name} ${student.student_last_name}'s Subjects`}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        A comprehensive list of subjects for the selected student.
      </Typography>
      <DataGrid
        rows={studentSubjects}
        columns={columns}
        getRowId={(row) => row.subject_code} // Use subject_code as the unique identifier
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight={false}
      />
    </Box>
  );
}
