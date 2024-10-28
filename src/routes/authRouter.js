const express = require("express");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");
const validator = require("validator"); //validtg
const bcrypt = require("bcrypt"); //hashing

const authRouter = express.Router();

//signupapi
authRouter.post("/signup", async (req, res) => {
  try {
    //validating req data before adding it to DB
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    //console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    }); // creating new instance of user model
    await user.save();
    //console.log("user of dummy added");
    res.send("sign up succesfull");
  } catch (error) {
    res.send("sign up failed due to " + error.message);
  }

  // console.log(req.body);
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body; //extracting data from login fields
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Credetials"); //checking email validity
    }
    const user = await User.findOne({ emailId: emailId }); //finding whether user woith given email exists or not
    if (!user) {
      throw new Error("u are not a signed user");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); //returns true or false(checking paswd)

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token); //storing token in cookie
      res.send("user loggedin succesfully");
    } else {
      throw new Error("login failed");
    }

    //console.log(isPasswordValid);
  } catch (error) {
    res.send("ERROR : " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  await res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("user logged out");
});

module.exports = authRouter;
