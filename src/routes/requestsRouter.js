const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestsRouter = express.Router();

requestsRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + "😍 is sending a request to you");
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = requestsRouter;
