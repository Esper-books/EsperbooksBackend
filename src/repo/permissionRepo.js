PermissionRepository = new require("../model/permission.js");
RolePermissionRepository = new require("../model/RolePermission");





  async function fetchPermissionsByRoleId(roleId, callback) {
    try {
      const result = await RolePermissionRepository.rolePermissionRepository.findAll({ where: { roleId: roleId } });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }


  async function getPermissionName(id, callback) {
    try {
      const result = await PermissionRepository.permissionRepository.findOne({ where: { id: id } });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }




  

  module.exports = {
    fetchPermissionsByRoleId,getPermissionName
};

