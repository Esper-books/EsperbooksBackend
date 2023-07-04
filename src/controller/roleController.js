var express = require("express");
var router = express.Router();
var roleRepository = require("../repo/roleRepo");
var sf = require("../service/security");


router.get("", sf.authenticateToken,sf.authorizeRoles('Admin Toolbox'), async (sreq, res) => {
  roleRepository.fetchAllRoles((data) => {
        return res.status(200).json({ responseCode: 200, responseBody: data });
      });
});



module.exports = router;
