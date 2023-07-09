var express = require("express");
var router = express.Router();
var UserRepo = require("../repo/userRepo");
var sf = require("../service/security");
var permissionRepo = require("../repo/permissionRepo");
var RoleRepository = require("../repo/roleRepo");
var UserRoleRepo = require("../repo/userRoleRepo");
var UserRolePermissionRepo = require("../repo/UserRolePermissionRepo");

router.post(
  "/grantaccess",
  sf.authenticateToken,
  sf.authorizeRoles("Admin Toolbox"),
  async (sreq, res) => {
    try {
      const user = await UserRepo.fetchUserByEmailPromise(sreq.body.email);
      if (user == null) return;
      const role = await RoleRepository.fetchRoleByRoleName(sreq.body.roleName);
      if (role == null) return;

      const userRole = await UserRoleRepo.fetchUserRoleThen({
        userId: user.id,
        roleId: role.id,
      });

      await UserRolePermissionRepo.deleteUserRolePermissionsRecord(userRole.id);

      for (const rp of sreq.body.permissions) {
        const p = await permissionRepo.getPermissionIdThen(rp.permissionName);
        UserRolePermissionRepo.createUpdateUserRolesPermission({
          userRoleId: userRole.id,
          permissionId: p.id,
          status: rp.status,
        });
      }

      return res
        .status(200)
        .json({ responseCode: 200, responseBody: "Success" });
    } catch (error) {
      console.error("An error occurred:", error);
      return res
        .status(500)
        .json({ responseCode: 500, responseBody: "Internal Server Error" });
    }
  }
);

module.exports = router;
