import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import Layout from "./../components/Layout/Layout";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const updateQuantity = (name, amount) => {
    const updatedCart = cartItems
      .map((item) =>
        item.name === name
          ? { ...item, quantity: item.quantity + amount }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemove = (name) => {
    const updatedCart = cartItems.filter((item) => item.name !== name);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setSnackbarMessage(`${name} removed from cart.`);
    setSnackbarOpen(true);
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    const currentOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrder = {
      id: Date.now(),
      items: cartItems,
      totalAmount,
    };

    localStorage.setItem(
      "orders",
      JSON.stringify([...currentOrders, newOrder])
    );

    setCartItems([]);
    localStorage.removeItem("cartItems");
    window.dispatchEvent(new Event("cartUpdated"));
    setSnackbarMessage("Checkout successful!");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Layout>
      <Box
        sx={{
          paddingTop: "90px", // Ensure space for the header
          margin: "80px auto", // Center the container
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          maxWidth: "800px", // Set a max width for the content
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ fontWeight: "600", marginBottom: "20px", color: "#333" }}
        >
          Your Cart
        </Typography>
        {cartItems.length > 0 ? (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {cartItems.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    display: "flex",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.image}
                    sx={{
                      height: "150px",
                      width: "150px",
                      borderRadius: "8px 0 0 8px",
                    }}
                  />
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "500", color: "#444" }}
                    >
                      {item.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#777", mb: 1 }}>
                      RM {parseFloat(item.price).toFixed(2)}
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mt: "auto" }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => updateQuantity(item.name, -1)}
                        sx={{ color: "black", borderColor: "clack", mr: 1 }}
                      >
                        -
                      </Button>
                      <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                      <Button
                        variant="outlined"
                        onClick={() => updateQuantity(item.name, 1)}
                        sx={{ color: "black", borderColor: "black", ml: 1 }}
                      >
                        +
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemove(item.name)}
                        sx={{ ml: 2 }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                Total: RM {totalAmount.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                size="medium"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6" align="center" sx={{ color: "#888", mt: 5 }}>
            Your cart is empty
          </Typography>
        )}
      </Box>

      {/* Snackbar for Checkout Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Cart;
