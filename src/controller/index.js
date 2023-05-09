var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.status(200).json({ success: 'Esperbook is up.....' })
});



const success = {}
module.exports = router;
