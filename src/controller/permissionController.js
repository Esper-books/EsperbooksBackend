var express = require("express");
var router = express.Router();
//var UserPermissionRep = require("../repo/UserPermissionRepo");
var UserRepo = require("../repo/userRepo")
var sf = require("../service/security");


router.get("", sf.authenticateToken,sf.authorizeRoles('Admin Toolbox'), async (sreq, res) => {

  UserRepo.fetchUserByEmail(sreq.query.email, (user) =>
  {
    UserPermissionRep.getUserPermissions(user.id , (data) =>{
      return res.status(200).json({ responseCode: 200, responseBody: data });
    });
  });

});



module.exports = router;
