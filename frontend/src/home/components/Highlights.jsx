import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SchoolIcon from "@mui/icons-material/School";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const items = [
  {
    icon: <SchoolIcon />,
    title: "Quality Education",
    description:
      "Our institution offers a high standard of education, focusing on both academic excellence and personal growth.",
  },
  {
    icon: <LocalLibraryIcon />,
    title: "Extensive Resources",
    description:
      "With a wide variety of learning materials, libraries, and online resources, we ensure our students have the best tools to succeed.",
  },
  {
    icon: <GroupAddIcon />,
    title: "Inclusive Community",
    description:
      "We foster an inclusive, supportive environment where every student feels valued and encouraged to participate.",
  },
  {
    icon: <EventAvailableIcon />,
    title: "Extracurricular Opportunities",
    description:
      "From sports to arts, our school offers various extracurricular activities that help students develop their interests and skills.",
  },
  {
    icon: <SupportAgentIcon />,
    title: "Dedicated Support",
    description:
      "Our counselors and faculty are always available to guide students through both academic challenges and personal development.",
  },
  {
    icon: <VerifiedUserIcon />,
    title: "Accredited Curriculum",
    description:
      "We offer an accredited curriculum that prepares students for future success, equipping them with essential life skills.",
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "grey.900",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Explore why our product stands out: adaptability, durability,
            user-friendly design, and innovation. Enjoy reliable customer
            support and precision in every detail.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: "inherit",
                  p: 3,
                  height: "100%",
                  borderColor: "hsla(220, 25%, 25%, 0.3)",
                  backgroundColor: "grey.800",
                }}
              >
                <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: "medium" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
