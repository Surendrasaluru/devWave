const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profileview", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    throw new Error(error.message);
  }

  //console.log(cookies);
});

profileRouter.patch("/profileedit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("cant edit those fields");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    //console.log(loggedInUser);

    await loggedInUser.save();
    res.json({
      message: `your profile update was succesful ${loggedInUser.firstName}`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
  }
});

module.exports = profileRouter;
