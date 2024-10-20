//we will define wat an user model and how it looks
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  // creation of schema for model
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema); // creating model with name Usermodel

module.exports = User;
