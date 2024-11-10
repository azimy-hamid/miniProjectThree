import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/system";

const userTestimonials = [
  {
    avatar: (
      <Avatar
        alt="Sarah Johnson"
        src="homeAssets/statics/images/testimonialsImages/1.jpg"
      />
    ),
    name: "Sarah Johnson",
    occupation: "Student, Grade 12",
    testimonial:
      "Attending this school has been an incredible journey. The teachers are so supportive, and the curriculum really prepares us for the real world. I’ve gained confidence in my abilities, and I’m excited about the future!",
  },
  {
    avatar: (
      <Avatar
        alt="Mr. Alan Parker"
        src="homeAssets/statics/images/testimonialsImages/2.jpg"
      />
    ),
    name: "Mr. Alan Parker",
    occupation: "Math Teacher",
    testimonial:
      "It's been a pleasure teaching here. The school fosters a great learning environment, and it's amazing to see the students grow academically and personally. I’m proud to be part of such a supportive community.",
  },
  {
    avatar: (
      <Avatar
        alt="Emily Davis"
        src="homeAssets/statics/images/testimonialsImages/3.jpg"
      />
    ),
    name: "Emily Davis",
    occupation: "Student, Grade 10",
    testimonial:
      "I love the extra-curricular activities offered here, from sports to music clubs. It’s great that we have so many opportunities to explore our passions while also getting a solid education.",
  },
  {
    avatar: (
      <Avatar
        alt="Mrs. Linda Carter"
        src="homeAssets/statics/images/testimonialsImages/4.jpg"
      />
    ),
    name: "Mrs. Linda Carter",
    occupation: "Science Teacher",
    testimonial:
      "This school’s commitment to hands-on learning has been incredible. The students are highly engaged, and we’ve implemented innovative teaching techniques that make science come alive for them.",
  },
  {
    avatar: (
      <Avatar
        alt="James Brown"
        src="homeAssets/statics/images/testimonialsImages/5.jpg"
      />
    ),
    name: "James Brown",
    occupation: "Student, Grade 11",
    testimonial:
      "The school spirit here is amazing. We really come together as a community, whether it's for sports events or school plays. This environment motivates me to push myself to do my best.",
  },
  {
    avatar: (
      <Avatar
        alt="Dr. Susan Lee"
        src="homeAssets/statics/images/testimonialsImages/6.jpg"
      />
    ),
    name: "Dr. Susan Lee",
    occupation: "Principal",
    testimonial:
      "It’s an honor to lead this school. We strive to provide a nurturing and academically rigorous environment, where every student feels valued and prepared for success beyond the classroom.",
  },
];

const whiteLogos = [
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628e8573c43893fe0ace_Sydney-white.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d520d0517ae8e8ddf13_Bern-white.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f46794c159024c1af6d44_Montreal-white.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a09d1f6337b1dfed14ab_colorado-white.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg",
];

const darkLogos = [
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg",
  "https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg",
];

const logoStyle = {
  width: "64px",
  opacity: 0.3,
};

export default function Testimonials() {
  const theme = useTheme();
  const logos = theme.palette.mode === "light" ? darkLogos : whiteLogos;

  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
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
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: "text.primary" }}
        >
          Student and Teacher Testimonials
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Hear from our students and faculty about the positive learning
          environment we offer. Discover why our school is the perfect place for
          academic and personal growth.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {userTestimonials.map((testimonial, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            key={index}
            sx={{ display: "flex" }}
          >
            <Card
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
              }}
            >
              <CardContent>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: "text.secondary" }}
                >
                  {testimonial.testimonial}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <CardHeader
                  avatar={testimonial.avatar}
                  title={testimonial.name}
                  subheader={testimonial.occupation}
                />
                <img
                  src={logos[index]}
                  alt={`Logo ${index + 1}`}
                  style={logoStyle}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
