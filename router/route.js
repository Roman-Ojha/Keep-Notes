const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const KeepNoteAppUserData = require("../models/userSchema");
const bcrypt = require("bcryptjs");

require("../db/dbConnection");

router.post("/register", async (req, res) => {
  const { username, email, phone, password, cpassword } = req.body;
  if (!username || !email || !phone || !password || !cpassword) {
    return res.status(422).json({ error: "Please Fill the Filed Properly" });
  }
  try {
    const userExist = await KeepNoteAppUserData.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    }
    if (password != cpassword) {
      return res.status(422).json({ error: "Password doesn't match" });
    }
    const userData = new KeepNoteAppUserData({
      username,
      email,
      phone,
      password,
      cpassword,
    });
    const userRegister = await userData.save();
    res.status(201).json({ message: "User Register Successfully" });
    console.log(userRegister);
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill the field properly" });
  }
  try {
    let token;
    const userLogin = await KeepNoteAppUserData.findOne({ email: email });
    if (!userLogin) {
      return res
        .status(400)
        .json({ error: "Error Login!!! User doesn't exist" });
    }
    const isPasswordMatch = await bcrypt.compare(password, userLogin.password);
    console.log(token);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ error: "Error Login!!! User doesn't exist" });
    }
    token = await userLogin.generateAuthToken();
    res.cookie("KeepNoteAppUserToken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
    });
    console.log(token);
    res.status(200).json({ message: "Login Successfully" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
