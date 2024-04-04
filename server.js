require("dotenv").config();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const jobRoute = require("./routes/job");
const cors = require("cors");

const express = require("express");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => console.log("DB failed to connect", error));

app.get("/api/health", (req, res) => {
  console.log("hey health");
  res.json({
    service: "Backend Joblisting Server",
    status: "active",
    time: new Date(),
  });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/job", jobRoute);
//  /api/v1/auth/register

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ errorMessage: "Something went wrong" });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`backend server running on ${port}`);
});
