var express = require("express");
var router = express.Router();
var roleRepository = require("../repo/roleRepo");
var permissionRepo = require("../repo/permissionRepo");
var sf = require("../service/security");
var userRolePermissionRepo = require("../repo/UserRolePermissionRepo");
var userRoleRepo = require("../repo/userRoleRepo");

router.get(
  "",
  sf.authenticateToken,
  sf.authorizeRoles("Admin Toolbox"),
  async (sreq, res) => {
    roleRepository.fetchAllRoles().then((data) => {
      return res.status(200).json({ responseCode: 200, responseBody: data });
    });
  }
);


router.get(
  "/permission",
  sf.authenticateToken,
  sf.authorizeRoles("Admin Toolbox"),
async (sreq, res) => {
  try {
    const response = [];
    const permissions = await permissionRepo.getPermissions();

    let npermissions = permissions.map((obj) => ({
      status: false,
      permissionName: obj.permissionName,
    }));

    const roles = await roleRepository.fetchAllRoles();

    for (const r of roles) {
      let newRecord;

      const userRole = await userRoleRepo.fetchUserRoleThen({ userId: sreq.user.id, roleId: r.id });

      if (userRole !== null) {
        const userRolePermissions = await userRolePermissionRepo.getUserRolePermissionsThen(userRole.id);

        const newPermissions = [];

        // const combinedArray = npermissions.map(permissionA => {
        //   const matchingPermissionB = userRolePermissions.find(permissionB => permissionB.permissionName === permissionA.permissionName);
          
        //   if (matchingPermissionB) {
        //     return {
        //       status: matchingPermissionB.status,
        //       permissionName: permissionA.permissionName
        //     };
        //   } else {
        //     return permissionA;
        //   }
        // });

       // npermissions ;
        newRecord = {
          role: r.name,
          permissions: []
        };
      } else {
        newRecord = {
          role: r.name,
          permissions: npermissions,
        };
      }

      response.push(newRecord);
    }

    return res.status(200).json({ responseCode: 200, responseBody: response });
  } catch (error) {
    // Handle error here
    console.error(error);
    return res.status(500).json({ responseCode: 500, responseBody: 'Internal Server Error' });
  }
}
);



module.exports = router;
