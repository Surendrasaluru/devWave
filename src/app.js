const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt"); //hashing
const validator = require("validator"); //validtg
const cookieParser = require("cookie-parser"); //reading cookies
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestsRouter = require("./routes/requestsRouter");
const userRouter = require("./routes/userRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("established successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("failed");
    console.log(err.message);
  });

/*finding a user by mail
app.get("/finduser", async (req, res) => {
  const userMail = req.body.emailId; //assigning mail to a varble
  try {
    const user = await User.findOne({ emailId: userMail }); //finding him
    if (user & (user.length === 0)) {
      res.send("sorry not found"); //if not found that array lenghtis 0
    } else {
      res.send(user); // if found return him
    }
  } catch (err) {
    res.send("something went wrong in finding user" + err.message);
  }
});

//feed api

//delete a user api
app.delete("/deleteuser", async (req, res) => {
  try {
    const userId = req.body._id; //_id assigned by official mongodb
    const user = await User.findByIdAndDelete(userId); //as per docs
    if (user) {
      res.send("user deleted succesfully");
    } else {
      res.send("user already deleted in past");
    }
  } catch (err) {
    res.status(400).send("something went wrong in deleting user");
  }
});

//updating a user
app.patch("/updateuser/:_id", async (req, res) => {
  const userId = req.params?._id; //_id assigned by official mongodb
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["age", "photoUrl", "about"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("you cant udpate those fields");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("user updated succesfully!");
  } catch (err) {
    res.send("something went wrong in updating");
    res.send(err.message);
  }
});*/
