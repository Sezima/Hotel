const express = require("express");
const router = express.Router();

const User = require("../models/User")
const {handleErrors, createToken} = require("../auth/controllers")

const maxAge = 3 * 24 * 60 * 60; 

router.get("/signup", (req, res) => {
  res.render("signup")
})

router.get("/login", (req, res) => {
  res.render("login")
})


/**
* @swagger
*  components:
*    schemas:
*      RegisterRequest:
*        type: object
*        properties:
*          email:
*            type: string
*            format: email
*          username:
*            type: string
*          password:
*            type: string
*        required:
*          - email
*          - username
*          - password
*/

/**
* @swagger 
*  /signup:
*    post:
*      summary: Register a new user
*      requestBody:
*        description: User registration data
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/RegisterRequest'
*      responses:
*        '201':
*          description: Successful registration
*        '400':
*          description: Invalid registration data
*/


router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(401).json({ errors });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in to the system
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Successful login
 *       '401':
 *         description: Invalid login credentials          
 */

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.signin(email, password);
    
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({user : user._id})
      // res.status(200).redirect("/");
    } catch (err) {
      const errors = handleErrors(err);
      res.status(401).json({ errors });
    }
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

module.exports = router;
