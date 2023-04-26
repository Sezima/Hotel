const express = require("express");
const router = express.Router();

const User = require("../models/User")
const {handleErrors, createToken} = require("../auth/controllers")

const maxAge = 3 * 24 * 60 * 60; 

router.get("/signup", (req, res) => {
  res.render("signup")
})

router.get("/signin", (req, res) => {
  res.render("signin")
})

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.signin(email, password);
    
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({user : user._id})
      // res.status(200).redirect("/");
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

module.exports = router;
