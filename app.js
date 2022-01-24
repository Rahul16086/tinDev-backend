const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const matchMakerRoutes = require("./routes/matchMaker");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.wkmpp.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
const app = express();

app.use(bodyParser.json());

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/app", matchMakerRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.use((error, rep, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 8080);
    console.log("DB Connected");
  })
  .catch((error) => {
    console.log(error);
  });
