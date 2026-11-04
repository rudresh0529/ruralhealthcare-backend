const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const hospitalRoutes = require("./routes/hospitals");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const resourceRoutes = require("./routes/resources");

// Connect routes
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/resources", resourceRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Rural Healthcare Connect Backend is Running!");
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend is working successfully"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});