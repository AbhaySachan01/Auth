require("dotenv").config();
const express = require("express");
const app =express();
const cors = require("cors");
const connection = require("./db")
const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
connection();

app.use(express.json());
app.use(cors());

app.use("/api/user",userRoutes);
app.use("/api/auth", (req, res, next) => {
    console.log("Auth route hit"); // ✅ Check request aa raha hai ya nahi
    next();
  }, authRoutes);

  
const port = process.env.PORT || 8080;
app.listen(port,()=>console.log(`Listening on port ${port}`))