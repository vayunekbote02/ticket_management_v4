// Imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const adminRoutes = require("./routes/admin.js");
const engineerRoutes = require("./routes/engineer.js");

// Connecting to database
mongoose
  .connect(
    "Enter your own mongodb connection string here."
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

// Initializations
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://192.168.1.26:5173"],
    methods: ["GET", "POST", "PUT", "UPDATE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/engineer", engineerRoutes);

// Starting the server
app.listen(8080, () => {
  console.log("Server started!");
});
