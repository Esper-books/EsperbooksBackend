PermissionRepository = require("../model/permission.js");
RolePermissionRepository = require("../model/RolePermission");





  async function fetchPermissionsByRoleId(roleId, callback) {
    try {
      const result = await RolePermissionRepository.findAll({ where: { roleId: roleId } });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }


  async function getPermissionName(id, callback) {
    try {
      const result = await PermissionRepository.findOne({ where: { id: id } });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }




  

  module.exports = {
    fetchPermissionsByRoleId,getPermissionName
};

