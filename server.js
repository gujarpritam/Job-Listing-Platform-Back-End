require("dotenv").config();
console.log(process.env.MONGODB_URI);
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");

const express = require("express");

const app = express();

app.use(express.json());

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
//  /api/v1/auth/register

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`backend server running on ${PORT}`);
});
