const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const dummyObj = {
    firstName: "chandu",
    lastName: "akula",
    emailId: "chandu@mail.com",
    password: "66666",
    age: 21,
    gender: "male",
  };

  const user = new User(dummyObj); // creating instance of user model
  await user.save();
  //console.log("user of dummy added");
  res.send("dummy used added");
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
