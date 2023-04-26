const bcrypt = require("bcrypt");
const fs = require("fs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60; // 3 days

const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  console.log(err)
  console.log(err.message, err.code);
  let errors = { username: "", email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if(err.message === "User validation failed: password: Minimum password length is 6 characters"){
    errors.password = "Minimum password length is 6 characters"
  }
  //duplicate error code

  if(err.message === "User validation failed: email: Please enter a valid email"){
    errors.email = "Please enter a valid email"
  }

  if (err.code === 11000) {
    errors.username = "That username is already registered";
    errors.email = "That email is already registered";
    return errors;
  }

  //validation errors:
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports = {createToken, handleErrors}