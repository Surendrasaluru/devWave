const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const app = express();

app.use(express.json());

//signupapi
app.post("/signup", async (req, res) => {
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
    res.send("dummy used added");
  } catch (error) {
    res.send("postfailed" + error.message);
  }

  // console.log(req.body);
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Credetials");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("u are not a signed user");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); //returns true or false

    if (isPasswordValid) {
      res.send("user loggedin succesfully");
    } else {
      throw new Error("login failed");
    }

    //console.log(isPasswordValid);
  } catch (error) {
    res.send("ERROR : " + error.message);
  }
});

//finding a user by mail
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
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({}); //empty filter returns everything
    res.send(user);
  } catch {
    res.status(400).send("something went wrong in getting feed");
  }
});

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
});

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
