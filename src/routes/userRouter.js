const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//get all pending connection requests of user
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "about", "gender"]);

    res.json({
      message: "data fetched suucessfully",
      connectionRequests,
    });
  } catch (err) {
    res.status(400).send("something happend wrong : " + err.message);
  }
});

userRouter.get("/user/connectionsview", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    if (!connectionRequests) {
      res.send("you have no connections");
    }

    res.json({ data });
  } catch (err) {
    res.status(400).send("something went wrong : " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = await req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 25 ? 25 : limit;
    const skip = limit * (page - 1);

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFeed.add(req.fromUserId.toString());
      hideUsersFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName about photoUrl")
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.send("something went wrong :" + err.message);
  }
});

module.exports = userRouter;
