import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllSubject } from "../../../../../services/subjectEndpoints";
import { useNavigate } from "react-router-dom";

export default function AllSubjectsTable() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getAllSubject();
        setSubjects(data.subjects);
        console.log(subjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleDetailsClick = (subjectId) => {
    navigate(`/admin/subject-details/${subjectId}`);
  };

  const handleUpdateClick = (subjectId) => {
    navigate(`/admin/update-subject/${subjectId}`);
  };

  const columns = [
    {
      field: "subject_code",
      headerName: "Subject Code",
      flex: 1,
      valueGetter: (value, row) => row?.subject_code || "N/A",
    },
    {
      field: "subject_name",
      headerName: "Subject Name",
      flex: 1,
      valueGetter: (value, row) => row?.subject_name || "N/A",
    },
    {
      field: "section",
      headerName: "Section",
      flex: 1,
      valueGetter: (value, row) => row?.subject_section || "N/A",
    },
    {
      field: "classroom_id_fk",
      headerName: "Classroom ID",
      flex: 1,
      valueGetter: (value, row) => row?.classroom?.classroom_code || "N/A",
    },
    {
      field: "grade_id_fk",
      headerName: "Grade Level",
      flex: 1,
      valueGetter: (value, row) => row?.Grade?.grade_level || "N/A", // Assuming you want to display the grade level
    },
    {
      field: "semester_id_fk",
      headerName: "Semester",
      flex: 1,
      valueGetter: (value, row) => row?.Semester?.semester_number || "N/A", // Assuming you want to display the semester number
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleDetailsClick(params.row.subject_id_pk)}
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
          onClick={() => handleUpdateClick(params.row.subject_id_pk)}
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
        Subjects Directory
        {console.log(subjects)}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        A comprehensive list of all registered subjects.
      </Typography>
      <DataGrid
        rows={subjects}
        columns={columns}
        getRowId={(row) => row.subject_id_pk}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight={false}
      />
    </Box>
  );
}
