const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const port = 5000;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const form = new FormData();
    form.append("image", req.file.buffer.toString("base64"));

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=28e39c5ec59e2cbfa3325d7243cef42e`,
      form,
      { headers: { ...form.getHeaders() } }
    );

    if (response.data.success) {
      res.json({ image: response.data.data.url });
    } else {
      res.status(500).json({ error: "Image upload failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error during image upload" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
