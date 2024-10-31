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

      //checking valid status or not
      if (!allowedStatus.includes(status)) {
        return res.json({ message: "invalid status type : " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        res.status(400).json({ message: "user not exists" });
      }

      // checking if xonnection alrdy present in db or not

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
      }

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
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  }
);

module.exports = requestsRouter;
