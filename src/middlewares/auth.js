const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new ERROR("token not found");
    }

    const decodedObj = await jwt.verify(token, "surendrad2731");

    const { _id } = decodedObj;

    const user = await User.findOne({ _id });

    if (!user) {
      throw new Error("user not logged in");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR : AUTHENTICATION FAILED");
  }
};

module.exports = { userAuth };
