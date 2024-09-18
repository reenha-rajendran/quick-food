import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Snackbar,
  Grid,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Layout from "./../components/Layout/Layout";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  useEffect(() => {
    const storedMeals = localStorage.getItem("meals");
    if (storedMeals) {
      setMenuItems(JSON.parse(storedMeals));
    }
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const updateQuantity = (menuItem, amount) => {
    setQuantities((prevQuantities) => {
      const newQty = Math.max(1, (prevQuantities[menuItem.name] || 1) + amount);
      return { ...prevQuantities, [menuItem.name]: newQty };
    });
  };

  const addToCart = (menuItem) => {
    const quantity = quantities[menuItem.name] || 1;
    const cartItem = {
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      quantity,
    };

    const updatedCart = [
      ...cartItems.filter((item) => item.name !== menuItem.name),
      cartItem,
    ];
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    // Dispatch a custom event to notify the cart icon that cartItems has changed
    window.dispatchEvent(new Event("cartUpdated"));

    setSnackbarMessage(
      `${menuItem.name} has been successfully added to your cart.`
    );
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCardClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedMenuItem(null);
  };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length <= 10) return description;
    return words.slice(0, 10).join(" ") + "...";
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          backgroundColor: "#f0f2f5",
          paddingTop: "70px",
          paddingBottom: "30px",
          paddingLeft: "20px",
          paddingRight: "20px",
          minHeight: "100vh",
        }}
      >
        {menuItems.map((menu, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                maxWidth: "290px",
                display: "flex",
                flexDirection: "column",
                m: 2,
                borderRadius: "12px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardActionArea onClick={() => handleCardClick(menu)}>
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    sx={{ height: "200px", borderRadius: "12px 12px 0 0" }}
                    component={"img"}
                    src={menu.image}
                    alt={menu.name}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "20px",
                      padding: "5px",
                      gap: "5px",
                    }}
                  >
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        updateQuantity(menu, -1);
                      }}
                      size="small"
                      sx={{ fontSize: "0.75rem", color: "#000" }}
                    >
                      -
                    </Button>
                    <Typography sx={{ mx: 1, fontSize: "0.75rem" }}>
                      {quantities[menu.name] || 1}
                    </Typography>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        updateQuantity(menu, 1);
                      }}
                      size="small"
                      sx={{ fontSize: "0.75rem", color: "#000" }}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={"bold"}
                      component={"div"}
                      sx={{ color: "#333" }}
                    >
                      {menu.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "green" }}
                    >
                      RM {parseFloat(menu.price).toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    pt={"10px"}
                    sx={{
                      maxHeight: "60px",
                      overflow: "hidden",
                      pb: "5px",
                      color: "#666",
                    }}
                  >
                    {truncateDescription(menu.description)}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    borderTop: "1px solid #e0e0e0",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      addToCart(menu);
                    }}
                    sx={{
                      color: "#ffa500",
                      fontWeight: "bold",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#ffcc80" },
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Box>

      {/* Snackbar to show success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog to show menu item details */}
      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog}>
        <DialogTitle>{selectedMenuItem?.name}</DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={selectedMenuItem?.image}
            alt={selectedMenuItem?.name}
            sx={{ width: "100%", borderRadius: "12px", mb: 2 }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Price: RM {selectedMenuItem?.price}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Description: {selectedMenuItem?.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Menu;
