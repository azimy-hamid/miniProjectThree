import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";

import { getNumberOfStudents } from "../../../../../services/studentEndpoints";

export function NumberOfStudentsChart() {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNumberOfStudents();
        if (response && response.studentsPerGrade) {
          const { totalStudents, studentsPerGrade } = response;
          setTotalStudents(totalStudents);
          setData(studentsPerGrade);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchData();
  }, []);

  const gradeLabels = data.map((grade) => grade.grade_code || "Unknown");
  const gradeCounts = data.map((grade) => grade.count);

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Students by Grade
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalStudents}
            </Typography>
            {/* <Chip size="small" color="success" label="+35%" /> */}
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Total students across all grades
          </Typography>
        </Stack>
        <BarChart
          xAxis={[{ scaleType: "band", data: gradeLabels }]}
          series={[{ data: gradeCounts }]}
          width={500}
          height={300}
        />
      </CardContent>
    </Card>
  );
}

// NumberOfStudentsChart.propTypes = {
//   theme: PropTypes.object,
// };
