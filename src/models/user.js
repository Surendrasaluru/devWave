//we will define wat an user model and how it looks
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    // creation of schema for model
    firstName: {
      type: String,
      required: true, //check
      uppercase: true, //always convert into lower case
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
      uppercase: true,
      required: true,
      minLength: 4,
      maxLength: 30,
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
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid url address: " + value);
        }
      },
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "surendrad2731", {
    expiresIn: "1d",
  }); //jwt token creating with secretkey and hidden info
  return token;
};
const User = mongoose.model("User", userSchema); // creating model with name Usermodel
//console.log(User.inspect());

module.exports = User;
