const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDB = require("./config/dbConnection");

const app = express();

// Middleware
dotenv.config();
app.use(express.json());
app.use(cors());

// db connection
connectToDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
