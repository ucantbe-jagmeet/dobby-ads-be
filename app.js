require("dotenv").config();
require("express-async-errors");

const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const path = require('path');

const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
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
const allowedOrigins = [
  'http://localhost:3000',
  'https://dobby-ads-fe.vercel.app'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use('/uploads', express.static('uploads'));
app.use(express.json());

// extra packages
app.use(cors(corsOptions));
app.use(xss());

// for image uploading


//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", authenticate, imageRouter);

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
