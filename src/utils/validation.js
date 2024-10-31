const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("enter your full name");
  } else if (firstName.length < 4 || firstName.length > 30) {
    throw new Error("first name must be between 4 and 30 characters length");
  } else if (lastName.length < 4 || lastName.length > 30) {
    throw new Error("last name must be between 4 and 30 characters length");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email is not valid");
  }
};

const validateEditProfileData = (req) => {
  const ALLOWEDFIELDS = [
    "firstName",
    "lastName",
    "age",
    "about",
    "photoUrl",
    "emailId",
  ];

  const isAllowed = Object.keys(req.body).every((field) =>
    ALLOWEDFIELDS.includes(field)
  );

  return isAllowed;
};

module.exports = {
  validateSignupData,
  validateEditProfileData,
};
