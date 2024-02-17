require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { authenticationMiddleware } = require("./middlewares/authentication");

const authRouter = require("./routes/auth");
const movieRouter = require("./routes/movie");
const theatreRouter = require("./routes/theatre");
const scheduleRouter = require("./routes/movieSchedule");

const PORT = process.env.PORT;
const MongoDB = process.env.MongoDB_URI;
app = express();

if (!PORT) throw new Error("Missing PORT");
if (!MongoDB) throw new Error("Missing MongoDB conection string");

mongoose
  .connect(MongoDB)
  .then(() => {
    console.log("MongoDB is connected..");
  })
  .catch(() => {
    console.log("MongoDB is not connected..");
  });

app.use(express.json());
app.use(cors());
app.use(authenticationMiddleware());

app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/movie`, movieRouter);
app.use(`/api/v1/theatre`, theatreRouter);
app.use(`/api/v1/schedule`, scheduleRouter);

app.get("/", (req, res) => {
  return res.json({ status: "Welcome to Movie App" });
});

app.listen(PORT, () => {
  console.log("Server is running...");
});
