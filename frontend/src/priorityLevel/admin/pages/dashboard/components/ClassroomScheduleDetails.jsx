import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getClassroomSchedule } from "../../../../../services/classroomEndpoints";
import { useParams, useNavigate } from "react-router-dom";

export default function ClassroomScheduleDetails() {
  const [schedules, setSchedules] = useState([]);
  const { classroomId } = useParams(); // Assuming classroomId is provided in the URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the classroom schedule for the selected classroom
        const response = await getClassroomSchedule(classroomId);
        console.log(response[0]);

        // Set the schedules if response is valid
        if (response) {
          setSchedules(response);
        } else {
          console.error("No schedules found in response.");
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchData();
  }, [classroomId]);

  const columns = [
    {
      field: "subject.subject_code",
      headerName: "Subject Code",
      flex: 1,
      valueGetter: (value, row) => row.subject.subject_code || "N/A",
    },
    {
      field: "subject.subject_name",
      headerName: "Subject Name",
      flex: 1,
      valueGetter: (value, row) => row.subject.subject_name || "N/A",
    },
    {
      field: "teacher",
      headerName: "Teacher",
      flex: 1,
      valueGetter: (value, row) => {
        // Check for teachers and return the full name if available
        const teachers = row.subject.Teachers;
        if (teachers.length > 0) {
          return `${teachers[0].teacher_first_name} ${teachers[0].teacher_last_name}`;
        }
        return "N/A"; // No teacher assigned
      },
    },
    {
      field: "schedules",
      headerName: "Schedules",
      flex: 2,
      renderCell: (params) => {
        // Ensure params.row exists
        if (!params.row) {
          console.error("Row is undefined.");
          return <Typography>Error: Row data not available</Typography>;
        }

        // Render schedules
        return (
          <Box>
            <Typography>{`${params.row.day_of_week} ${params.row.start_time} - ${params.row.end_time}`}</Typography>
          </Box>
        );
      },
    },
    {
      field: "classroom.classroom_code",
      headerName: "Classroom",
      flex: 1,
      valueGetter: (value, row) => {
        return row.classroom?.classroom_code || "N/A";
      },
    },
    {
      field: "subject.Grade.grade_level",
      headerName: "Grade",
      flex: 1,
      valueGetter: (value, row) => row.subject.Grade?.grade_level || "N/A",
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", marginTop: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Classroom Schedule
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        Detailed information about classroom schedules.
      </Typography>
      <DataGrid
        rows={schedules}
        columns={columns}
        getRowId={(row) => row.schedule_id_pk}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight
      />
      <Box textAlign="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
        >
          Back to Teacher Directory
        </Button>
      </Box>
    </Box>
  );
}
