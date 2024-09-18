import React from "react";
import Layout from "./../components/Layout/Layout";
import { Box, Typography, Container } from "@mui/material";

const About = () => {
  return (
    <Layout>
      <Box
        sx={{
          py: 7, // Adjust this value if needed to create space from the header
          backgroundColor: "#f9f9f9",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            p: 4,
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: 3,
            textAlign: "center",
            padding: "50px",
            marginTop: "50px", // Add margin top to push content down from the header
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
            Welcome To Quick Food!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              textAlign: "justify",
              lineHeight: 1.6,
              color: "#333",
              fontSize: "1rem",
            }}
          >
            Dear Valued Guest,
            <p style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
              We are delighted to have you here! At Quick Food, we believe that
              every meal should be a memorable experience filled with delicious
              flavors and warm hospitality. Our team is dedicated to serving you
              the finest dishes made with fresh, high-quality ingredients.
              Whether you’re here for a quick bite or a leisurely meal, we are
              committed to making your visit enjoyable and satisfying. Take your
              time to explore our menu, and don’t hesitate to ask our staff for
              recommendations. Your satisfaction is our top priority, and we’re
              here to cater to your every need. Thank you for choosing Quick
              Food. We look forward to serving you!
            </p>
            Warm regards,
            <p>The Quick Food Team</p>
          </Typography>
        </Container>
      </Box>
    </Layout>
  );
};

export default About;
