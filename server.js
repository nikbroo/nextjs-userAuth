require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const authRoute = require("./routes/auth-routes");
const homeRoute = require("./routes/home-routes");
const imageRoute = require("./routes/image-routes");

connectToDB();

const app = express();
const PORT = process.env.PORT || 3011;

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("connected");
});
app.use("/api/auth", authRoute);
app.use("/api/home", homeRoute);
app.use("/api/image", imageRoute);

app.listen(PORT, () => {
  console.log("server running on port 3011");
});
