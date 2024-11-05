import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllClassroom } from "../../../../../services/classroomEndpoints";
import { useNavigate } from "react-router-dom";

export default function AllClassroomsTable() {
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllClassroom()
      .then((data) => {
        setClassrooms(data);
      })
      .catch((error) => {
        console.error("Error fetching classrooms:", error);
      });
  }, []);

  const handleDetailsClick = (classroomId) => {
    navigate(`/admin/classroom-details/${classroomId}`);
  };

  const handleUpdateClick = (classroomId) => {
    navigate(`/admin/update-classroom/${classroomId}`);
  };

  const columns = [
    { field: "classroom_code", headerName: "Classroom Code", flex: 1 },
    { field: "capacity", headerName: "Capacity", flex: 1 },
    { field: "room_type", headerName: "Room Type", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleDetailsClick(params.row.classroom_id_pk)}
        >
          Details
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", marginTop: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Classroom Directory
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        A comprehensive list of all available classrooms.
      </Typography>
      <DataGrid
        rows={classrooms}
        columns={columns}
        getRowId={(row) => row.classroom_id_pk}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight={false}
      />
    </Box>
  );
}
