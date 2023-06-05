var express = require("express");
var router = express.Router();
var userRepository = require("../repo/userRepo");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secretKey = "secret esperbook";
var util = require("../utils/util");

router.post("", (req, res) => {
  reqBody = req.body;
  reqBody.password = util.encrypt(reqBody.password,secretKey);
  userRepository
    .fetchUserByUserPassword(reqBody, (presp) => {
      if (presp == null)
        return res.status(401).json({ message: "Invalid credentials" });
      if (presp.emailAddress !== reqBody.email) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
 
      if (presp.password === reqBody.password) {
        const token = jwt.sign(
          { password: reqBody.password, emailAddress: reqBody.emailAddress },
          secretKey,
          { expiresIn: "1h" }
        );
        // Send the token to the client
        return res.status(200).json({ token });
       
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
