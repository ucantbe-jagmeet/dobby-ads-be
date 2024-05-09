require("dotenv").config();
require("express-async-errors");

const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

//connectDB
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/auth");


app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
// extra packages
app.use(cors());
app.use(xss());

//routes
app.use("/api/v1/auth", authRouter);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
