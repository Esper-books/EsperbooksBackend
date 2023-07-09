var express = require("express");
var router = express.Router();
var roleRepository = require("../repo/roleRepo");
var permissionRepo = require("../repo/permissionRepo");
var sf = require("../service/security");
var userRolePermissionRepo = require("../repo/UserRolePermissionRepo");
var userRoleRepo = require("../repo/userRoleRepo");
var userRepo = require("../repo/userRepo");

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
      const { email } = sreq.query;
      const response = [];

      const user = await userRepo.fetchUserByEmailPromise(email);

      if (user == null)
        res
          .status(404)
          .json({ responseCode: 404, responseBody: "User not found." });

      const permissions = await permissionRepo.getPermissions();

      let npermissions = permissions.map((obj) => ({
        status: false,
        permissionName: obj.permissionName,
      }));

      const roles = await roleRepository.fetchAllRoles();

      for (const r of roles) {
        let newRecord;

        const userRole = await userRoleRepo.fetchUserRoleThen({
          userId: user.id,
          roleId: r.id,
        });

        if (userRole !== null) {
          const userRolePermissions =
            await userRolePermissionRepo.getUserRolePermissionsThen(
              userRole.id
            );
          if (userRolePermissions != null) {
            newRecord = {
              role: r.name,
              permissions: userRolePermissions,
            };
          } else continue;
        } else {
          newRecord = {
            role: r.name,
            permissions: npermissions,
          };
        }

        response.push(newRecord);
      }

      return res
        .status(200)
        .json({ responseCode: 200, responseBody: response });
    } catch (error) {
      // Handle error here
      console.error(error);
      return res
        .status(500)
        .json({ responseCode: 500, responseBody: "Internal Server Error" });
    }
  }
);

router.get(
  "/getAssignedRoles",
  sf.authenticateToken,
  sf.authorizeRoles("Admin Toolbox"),
  async (sreq, res) => {
    try {
      const { email } = sreq.query;

      const user = await userRepo.fetchUserByEmailPromise(email);

      if (user == null)
        res
          .status(404)
          .json({ responseCode: 404, responseBody: "User not found." });
      return roleRepository.getAssignedRoles(user.id, (data) => {
        return res.status(200).json({ responseCode: 200, responseBody: data });
      });
    } catch (error) {
      // Handle error here
      console.error(error);
      return res
        .status(500)
        .json({ responseCode: 500, responseBody: "Internal Server Error" });
    }
  }
);

router.post(
  "/updateUserRoles",
  sf.authenticateToken,
  sf.authorizeRoles("Admin Toolbox"),
  async (sreq, res) => {
    try {
      const { email } = sreq.query;
      const { action } = sreq.query;

      if ((action == 'assignRoles') || (action == 'unassignRoles')) {
    
      const user = await userRepo.fetchUserByEmailPromise(email);

      if (user == null)
        return res
          .status(404)
          .json({ responseCode: 404, responseBody: "User not found." });

      if (action == 'assignRoles') {
        for (const r of sreq.body.roles) {
          const role = await roleRepository.fetchRoleByRoleName(r.roleName);
          if (role !=null){
            await roleRepository.updateUserRoles({
              userId: user.id,
              roleId: role.id,
            });
          }
        }
      } else if (action == 'unassignRoles') {
        for (const r of sreq.body.roles) {
          const role = await roleRepository.fetchRoleByRoleName(r.roleName);
          if (role !=null){
            await roleRepository.deleteUserRoleRecord({
              userId: user.id,
              roleId: role.id,
            });
          }
         
        }
      }
      return roleRepository.getAssignedRoles(user.id, (data) => {
        return res.status(200).json({ responseCode: 200, responseBody: data });
      });
    } else {
      return res
      .status(400)
      .json({
        responseCode: 400,
        responseBody: "Invalid action value in query param",
      });
  
    }
    } catch (error) {
      // Handle error here
      console.error(error);
      return res
        .status(500)
        .json({ responseCode: 500, responseBody: "Internal Server Error" });
    }
  }
);

module.exports = router;
