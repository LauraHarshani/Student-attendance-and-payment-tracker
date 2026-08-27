const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config();

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

//import routes
const AttendanceRoutes = require("./routes/AttendanceRoutes");

//Use Routes
app.use("/api/attendance", AttendanceRoutes);

//mongodb connection
const URL = process.env.MONGODB_URI;
mongoose.connect(URL).then(()=>{
    console.log("MongoDB connected successfully")
}).catch((error)=>{
    console.error("MongoDB connection error: ", error)
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
})