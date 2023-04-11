import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

//Register Endpoint
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ message: "User Already Exists!" });
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password: hashedPassword });

  //Save new user to database
  await newUser.save();

  res.json({ message: "User Registered Successfully!" });
});

//Login Endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (!user) {
    return res.json({ message: "Username or Password Is Incorrect!" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: "Username or Password Is Incorrect!" });
  }

  //sign jsonwebtoken to verify original user 
  const secret = process.env.SECRET
  const token = jwt.sign({ id: user._id }, secret);

  //send token and userID
  res.json({ token, userID: user._id });
});

export { router as userRouter };
