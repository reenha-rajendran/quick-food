import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isUserPage = location.pathname === "/menu";
  const buttonText = isUserPage ? "Go to Admin Page" : "Go to User Page";
  const navigateTo = isUserPage ? "/admin" : "/menu";

  const handleToggleClick = () => {
    navigate(navigateTo);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        bgcolor: "#ffa500",
        color: "black",
        p: 1,
        width: "100%",
        mt: "auto", // Makes the footer push to the bottom when there is little content
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <Button
          variant="outlined"
          color="black"
          onClick={handleToggleClick}
          sx={{ mx: 1 }}
        >
          {buttonText}
        </Button>
      </Box>

      <Typography
        variant="body1"
        sx={{
          "@media (max-width:600px)": {
            fontSize: "1rem",
          },
        }}
      >
        All Rights Reserved &copy; Quick Food
      </Typography>
    </Box>
  );
};

export default Footer;
