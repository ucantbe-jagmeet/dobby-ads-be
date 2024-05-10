require("dotenv").config();
require("express-async-errors");

const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const path = require('path');

const express = require("express");
const app = express();

//connectDB
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/auth");
const imageRouter = require("./routes/image");
const authenticate = require('./middleware/authenticate');

// app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//   })
// );
app.use(express.json());
// extra packages
app.use(cors());
app.use(xss());

// for image uploading


//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", authenticate, imageRouter);
app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 3333;

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
