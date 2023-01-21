var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//  res.status.('index', { title: 'Express' });
  return res.status(200).json({ success: 'Timeout. Please try again' })
});



const success = {}
module.exports = router;
