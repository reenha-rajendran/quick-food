import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Logo from "../../images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/HeaderStyles.css";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCartUpdate = () => {
      const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const totalQuantity = storedCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartItemCount(totalQuantity);
    };

    handleCartUpdate();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" component="div" sx={{ my: 2 }}>
        <img src={Logo} alt="logo" height={"50"} width={"100"} />
      </Typography>
      <Divider />
      <ul
        className="mobile-navigation"
        style={{ listStyleType: "none", padding: 0 }}
      >
        <li>
          <NavLink
            activeClassName="active"
            to={"/"}
            style={{ textDecoration: "none", color: "black" }}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/about"}
            style={{ textDecoration: "none", color: "black" }}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/contact"}
            style={{ textDecoration: "none", color: "black" }}
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </Box>
  );

  return (
    <>
      <AppBar
        component="nav"
        sx={{ bgcolor: "#ffffff", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={Logo} alt="logo" height={"50"} width={"100"} />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            <NavLink
              to={"/"}
              style={({ isActive }) => ({
                color: isActive ? "#ffa500" : "black",
                textDecoration: "none",
                marginRight: "30px",
                fontWeight: "bold",
              })}
            >
              Home
            </NavLink>
            <NavLink
              to={"/about"}
              style={({ isActive }) => ({
                color: isActive ? "#ffa500" : "black",
                textDecoration: "none",
                marginRight: "30px",
                fontWeight: "bold",
              })}
            >
              About
            </NavLink>
            <NavLink
              to={"/contact"}
              style={({ isActive }) => ({
                color: isActive ? "#ffa500" : "black",
                textDecoration: "none",
                fontWeight: "bold",
              })}
            >
              Contact
            </NavLink>
          </Box>
          <IconButton
            color="primary"
            aria-label="cart"
            onClick={handleCartClick}
            sx={{ ml: 2 }}
          >
            <Badge
              badgeContent={cartItemCount}
              color="success" // Change to "error" for better visibility
              sx={{
                "& .MuiBadge-dot": { backgroundColor: "#ffa500" }, // Optional: Customize badge dot color
                "& .MuiBadge-root": {
                  border: "1px solid #ffa500", // Add a border to the badge
                  borderRadius: "50%", // Make it round
                },
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: "1.8rem", color: "#333" }} />{" "}
              {/* Adjust icon size */}
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
