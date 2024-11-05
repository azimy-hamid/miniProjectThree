import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllStudents } from "../../../../../services/studentEndpoints";
import { useNavigate } from "react-router-dom";

export default function AllStudentsTable() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleDetailsClick = (studentId) => {
    navigate(`/admin/student-details/${studentId}`);
  };

  const handleUpdateClick = (studentId) => {
    navigate(`/admin/update-student/${studentId}`);
  };

  const columns = [
    {
      field: "student_code",
      headerName: "Student Code",
      flex: 1,
      valueGetter: (value, row) => row.student_code || "N/A",
    },
    {
      field: "student_first_name",
      headerName: "First Name",
      flex: 1,
      valueGetter: (value, row) => row.student_first_name || "N/A",
    },
    {
      field: "student_last_name",
      headerName: "Last Name",
      flex: 1,
      valueGetter: (value, row) => row.student_last_name || "N/A",
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      valueGetter: (value, row) => row.gender || "N/A",
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      flex: 1,
      valueGetter: (value, row) =>
        new Date(row.dob).toLocaleDateString() || "N/A",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      valueGetter: (value, row) => row.email || "N/A",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      valueGetter: (value, row) => row.phone || "N/A",
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleDetailsClick(params.row.student_id_pk)}
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
          onClick={() => handleUpdateClick(params.row.student_id_pk)}
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
        Students Directory
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        A comprehensive list of all registered students.
      </Typography>
      <DataGrid
        rows={students}
        columns={columns}
        getRowId={(row) => row.student_id_pk}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight={false}
      />
    </Box>
  );
}
