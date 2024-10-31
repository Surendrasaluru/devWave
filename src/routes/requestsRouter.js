const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestsRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; //from userauth req
      const toUserId = req.params.toUserId; //from router
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      //checking valid status or not i.e only ignored and interested must be taken
      if (!allowedStatus.includes(status)) {
        return res.json({ message: "invalid status type : " + status });
      }
      // the user to whom we were sending a req must exist in DB.
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        res.status(400).json({ message: "user not exists" });
      }

      // checking if connection alrdy present in db or not
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId }, //already exists logic
          { fromUserId: toUserId, toUserId: fromUserId }, //a to b and b to a viceversa
        ],
      });

      if (existingConnectionRequest) {
        res
          .status(400)
          .send(`connection request already exisst with ${toUser.firstName}`);
      } else {
        const connectionRequest = new ConnectionRequest({
          fromUserId,
          toUserId,
          status,
        });

        const data = await connectionRequest.save();
        res.json({
          message:
            req.user.firstName + " is " + status + " in " + toUser.firstName,
          data,
        });
      }
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  }
);

requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({
          message: "invalid request status",
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        res.status(400).json({
          message: "connection request not found",
        });
      }
      //status in LHS is to be modified and status in RHS is from params
      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: loggedInUser.firstName + " has " + data.status + " request.",
        data,
      });
    } catch (error) {
      res.status(400).send("something happend wrong : " + error.message);
    }
  }
);

module.exports = requestsRouter;
