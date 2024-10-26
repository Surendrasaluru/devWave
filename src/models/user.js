//we will define wat an user model and how it looks
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    // creation of schema for model
    firstName: {
      type: String,
      required: true, //check
      uppercase: true, //always convert into lower case
      minLength: 4,
    },
    lastName: {
      type: String,
      uppercase: true,
      minLength: 4,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female"].includes(value)) {
          throw new error("gender is not valid");
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
    },
    age: {
      type: Number,
    },
    photoUrl: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/hand-drawn-programmer-work_52683-17782.jpg?uid=R134257556&ga=GA1.1.752565634.1729341420&semt=ais_hybrid",
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema); // creating model with name Usermodel

module.exports = User;
