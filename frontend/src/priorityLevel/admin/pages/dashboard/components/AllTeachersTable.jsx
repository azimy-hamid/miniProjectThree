import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllTeachers } from "../../../../../services/teacherEndpoints.js";
import { useNavigate } from "react-router-dom";

export default function AllTeachersTable() {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

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

  const handleUpdateClick = (teacherId) => {
    navigate(`/admin/update-teacher/${teacherId}`); // Navigate to the update route
  };

  const columns = [
    { field: "teacher_first_name", headerName: "First Name", flex: 1 },
    { field: "teacher_last_name", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "working_days", headerName: "Working Days", flex: 1 },
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
      field: "update",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleUpdateClick(params.row.teacher_id_pk)}
        >
          Update
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
    </Box>
  );
}
