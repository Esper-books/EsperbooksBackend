var express = require("express");
var router = express.Router();
var userRepository = require("../repo/userRepo");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secretKey = "secret esperbook";

router.post("", (req, res) => {
  reqBody = req.body;
  reqBody.password= encryptPassword(reqBody.password, salt);
  userRepository
    .fetchUserByEmail(reqBody.email, (presp) => {
      if (presp == null) return res.status(401).json({ message: "Invalid credentials" });
      if (presp.emailAddress !== reqBody.email) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      userRepository
        .fetchUserByPassword(reqBody.password, (presp) => {
          if (presp == null) return res.status(401).json({ message: "Invalid credentials" });
          if (presp.password !== reqBody.password) {
            return res.status(401).json({ message: "Invalid credentials" });
          }
         
    

          const token = jwt.sign({ password: reqBody.password, emailAddress: reqBody.emailAddress }, secretKey, { expiresIn: "1h" });
          // Send the token to the client
          return res.status(200).json({ token });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });

});

const salt = crypto.randomBytes(16);
function encryptPassword(password, salt) {
  const key = crypto.scryptSync(password, salt, 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, salt);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}



module.exports = router;
