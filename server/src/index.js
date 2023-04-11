//NPM Libraries
import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import { userRouter } from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(cors());

//connect to MongoDB
const uri = process.env.DB_URI;

mongoose.connect(uri)
  .then(() => {
    console.log("Connection estabislished with MongoDB");
  })
  .catch((error) => console.error(error.message));

//Routes
app.use("/auth", userRouter);


app.listen(3001, () => console.log("SERVER STARTED!"));
