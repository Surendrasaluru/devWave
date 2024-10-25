const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body); // creating new instance of user model
  await user.save();
  //console.log("user of dummy added");
  res.send("dummy used added");
  // console.log(req.body);
});

//finding a user by mail
app.get("/finduser", async (req, res) => {
  const userMail = req.body.emailId; //assigning mail to a varble
  try {
    const user = await User.findOne(userMail); //finding him
    if (user.length === 0) {
      res.send("sorry not found"); //if not found that array lenghtis 0
    } else {
      res.send(user); // if found return him
    }
  } catch (err) {
    res.send("something went wrong in finding user");
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
app.patch("/updateuser", async (req, res) => {
  const userId = req.body._id; //_id assigned by official mongodb
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("user updated succesfully!");
  } catch (err) {
    res.send("something went wrong in updating");
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
