import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAssignedSubjects } from "../../../../../services/teacherEndpoints.js";
import { useNavigate } from "react-router-dom";

export default function AllSubjectsForTheTeacherTable({ teacher }) {
  const [subjects, setSubjects] = useState([]);
  const teacherId = localStorage.getItem("user_id_fk");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the assigned subjects for the selected teacher
        const response = await getAssignedSubjects(teacherId);

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
  }, [teacherId]);

  const columns = [
    { field: "subject_code", headerName: "Subject Code", flex: 1 },
    { field: "subject_name", headerName: "Subject Name", flex: 1 },
    {
      field: "schedules",
      headerName: "Schedules",
      flex: 2,
      renderCell: (params) => {
        // console.log("Rendering cell with params:", params); // Log params

        // Ensure params.row exists
        if (!params.row) {
          console.error("Row is undefined.");
          return <Typography>Error: Row data not available</Typography>;
        }

        // Ensure schedules exists and is an array
        if (!Array.isArray(params.row.schedules)) {
          console.error(
            "Schedules is not an array or is undefined:",
            params.row.schedules
          );
          return <Typography>No schedule data</Typography>;
        }

        // Render schedules
        return (
          <Box>
            {params.row.schedules.length > 0 ? (
              params.row.schedules.map((schedule, index) => (
                <Typography key={index}>
                  {`${schedule.day_of_week} ${schedule.start_time} - ${schedule.end_time}`}
                </Typography>
              ))
            ) : (
              <Typography>No schedule</Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "classroom_code",
      headerName: "Classroom",
      flex: 1,
      valueGetter: (value, row) => {
        return row.classroom?.classroom_code || "N/A";
      },
    },
    {
      field: "grade_level",
      headerName: "Grade",
      flex: 1,
      valueGetter: (value, row) => row.Grade?.grade_level || "N/A",
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
            navigate(`/teacher/subject-details/${params.row.subject_id_pk}`)
          } // Adjust the path as necessary
        >
          Mark Attendance
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", marginTop: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        {`Subjects assigned to ${teacher.teacher_first_name} ${teacher.teacher_last_name}`}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        Detailed information about assigned subjects, classrooms, and schedules.
      </Typography>
      <DataGrid
        rows={subjects}
        columns={columns}
        getRowId={(row) => row.subject_id_pk}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight
      />
    </Box>
  );
}
