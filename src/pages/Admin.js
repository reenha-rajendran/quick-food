import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

function AdminPage() {
  const [open, setOpen] = useState(false);
  const [meals, setMeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [completedOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null); // State to track which meal is being edited

  useEffect(() => {
    const storedMeals = localStorage.getItem("meals");
    if (storedMeals) {
      setMeals(JSON.parse(storedMeals));
    }
  }, []);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  useEffect(() => {
    if (meals.length > 0) {
      localStorage.setItem("meals", JSON.stringify(meals));
    }
  }, [meals]);

  const handleClickOpen = () => {
    setOpen(true);
    setFormData({ name: "", description: "", price: "", image: null });
    setImagePreview(null);
    setEditIndex(null); // Reset edit index when opening the dialog
  };

  const handleEditOpen = (index) => {
    const mealToEdit = meals[index];
    setFormData({
      name: mealToEdit.name,
      description: mealToEdit.description,
      price: mealToEdit.price,
      image: mealToEdit.image,
    });
    setImagePreview(mealToEdit.image); // Show existing image
    setEditIndex(index); // Set the index for editing
    setOpen(true); // Open dialog
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", description: "", price: "", image: null });
    setImagePreview(null);
    setEditIndex(null); // Reset edit index when closing the dialog
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      if (
        file &&
        ["image/jpeg", "image/png"].includes(file.type) &&
        file.size <= 5000000
      ) {
        setImagePreview(URL.createObjectURL(file));
        setFormData({ ...formData, image: file });
      } else {
        alert(
          "Invalid file type or size. Please select an image up to 5MB and in JPG or PNG format."
        );
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadImageToServer = async () => {
    if (!formData.image) {
      throw new Error("No image file selected");
    }

    const formDataToUpload = new FormData();
    formDataToUpload.append("image", formData.image);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=28e39c5ec59e2cbfa3325d7243cef42e`,
        {
          method: "POST",
          body: formDataToUpload,
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        return result.data.url; // Return the image URL
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.image
    ) {
      alert("All fields are required, including the image.");
      return;
    }

    try {
      console.log("Starting upload...");
      setUploading(true);
      const imageUrl = await uploadImageToServer();
      const newMeal = {
        ...formData,
        price: parseFloat(formData.price),
        image: imageUrl,
      };

      if (editIndex !== null) {
        // If editing, update the existing meal
        const updatedMeals = meals.map((meal, index) =>
          index === editIndex ? newMeal : meal
        );
        setMeals(updatedMeals);
        setSnackbarMessage("Food item updated successfully.");
      } else {
        // If adding new meal, just append to the list
        setMeals((prevMeals) => [...prevMeals, newMeal]);
        setSnackbarMessage("Food item added successfully.");
      }

      setUploading(false);
      handleClose();
      console.log("Upload complete. Form submitted.");
    } catch (error) {
      console.error("Error uploading image: ", error);
      setUploading(false);
    }
  };

  const handleDelete = (index) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    setMeals(updatedMeals);
    localStorage.setItem("meals", JSON.stringify(updatedMeals));
    setSnackbarMessage("Food item deleted successfully.");
    setOpenSnackbar(true);
  };

  const handleOrderDelete = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setSnackbarMessage("Order deleted successfully.");
    setOpenSnackbar(true);
  };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length <= 10) return description;
    return words.slice(0, 10).join(" ") + "...";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: "#e0e0e0", textAlign: "center" }}>
        <Typography variant="h6">Header</Typography>
      </Box>

      {/* Main Layout */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 240,
            bgcolor: "#ffffff",
            padding: "20px",
            borderRight: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button
            onClick={() => setActivePage("dashboard")}
            variant={activePage === "dashboard" ? "contained" : "text"}
            color="primary"
            sx={{
              mb: 1,
              backgroundColor:
                activePage === "dashboard" ? "#ffa500" : "default",
              color: activePage === "dashboard" ? "#000" : "inherit",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => setActivePage("orders")}
            variant={activePage === "orders" ? "contained" : "text"}
            color="primary"
            sx={{
              mb: 1,
              backgroundColor: activePage === "orders" ? "#ffa500" : "default",
              color: activePage === "orders" ? "#000" : "inherit",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Orders
          </Button>
          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            backgroundColor: "#f0f2f5",
          }}
        >
          {activePage === "dashboard" ? (
            <div>
              <Typography
                variant="h4"
                component="div"
                sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
              >
                Admin Dashboard
              </Typography>
              <Button
                onClick={handleClickOpen}
                variant="contained"
                sx={{
                  mb: 2,
                  backgroundColor: "#ffa500",
                  color: "#000000",
                  "&:hover": {
                    backgroundColor: "#cc8400",
                  },
                  borderRadius: "20px",
                  textTransform: "none",
                }}
              >
                Add New Food Item
              </Button>

              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                  {editIndex !== null ? "Edit Food Item" : "Add New Food Item"}
                </DialogTitle>
                <DialogContent>
                  <TextField
                    margin="dense"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <input
                      accept="image/*"
                      type="file"
                      name="image"
                      onChange={handleInputChange}
                      style={{ marginBottom: 10 }}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="default">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    color="primary"
                    disabled={uploading} // Disable button while uploading
                  >
                    {uploading
                      ? "Uploading..."
                      : editIndex !== null
                      ? "Update"
                      : "Add"}
                  </Button>
                </DialogActions>
              </Dialog>

              <Grid container spacing={1}>
                {meals.map((meal, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                      sx={{
                        maxWidth: "290px",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        borderRadius: "12px",
                      }}
                    >
                      <CardActionArea>
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            sx={{ height: "200px" }}
                            image={meal.image}
                            alt={meal.name}
                          />
                        </Box>
                        <CardContent
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            padding: "16px",
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
                            >
                              {meal.name}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold", color: "green" }}
                            >
                              RM {parseFloat(meal.price).toFixed(2)}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            pt={"10px"}
                            sx={{
                              maxHeight: "60px",
                              overflow: "hidden",
                              pb: "5px",
                            }}
                          >
                            {truncateDescription(meal.description)}
                          </Typography>
                        </CardContent>
                        <Box
                          sx={{
                            borderTop: "1px solid #e0e0e0",
                            padding: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            onClick={() => handleEditOpen(index)} // Open edit dialog
                            color="primary"
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: "bold", borderRadius: "20px" }}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(index)}
                            color="error"
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: "bold", borderRadius: "20px" }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          ) : (
            <div>
              <Typography
                variant="h4"
                component="div"
                sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
              >
                Orders Page
              </Typography>
              <Grid container spacing={2}>
                {orders.map((order) => (
                  <Grid item xs={12} key={order.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Order #{order.id}</Typography>
                        {order.items.map((item, index) => (
                          <Typography key={index}>
                            {item.name} x {item.quantity} - RM{" "}
                            {item.price * item.quantity}
                          </Typography>
                        ))}
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="h6">
                          Total: RM {order.totalAmount.toFixed(2)}
                        </Typography>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOrderDelete(order.id)} // Handle order deletion
                          sx={{ mt: 2 }}
                        >
                          Remove Order
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={2}>
                {completedOrders.map((completedOrder) => (
                  <Grid item xs={12} key={completedOrder.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">
                          Completed Order #{completedOrder.id}
                        </Typography>
                        {completedOrder.items.map((item, index) => (
                          <Typography key={index}>
                            {item.name} x {item.quantity} - RM{" "}
                            {item.price * item.quantity}
                          </Typography>
                        ))}
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="h6">
                          Total: RM {completedOrder.totalAmount.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
        </Box>
      </Box>

      {/* Snackbar for success messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminPage;
