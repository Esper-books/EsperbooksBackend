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

  async function getPermissionId(permissionName, callback) {
    try {
      const result = await PermissionRepository.findOne({    
         attributes: [
        [sequelize.literal('id'), 'id'] 
      ], where: { permissionName: permissionName } });
      callback(result);
    } catch (error) {
      console.error(error);
      return null ;
    } 
  }

  async function getPermissionIdThen(permissionName) {
    try {
      const result = await PermissionRepository.findOne({    
         attributes: [
        [sequelize.literal('id'), 'id'] 
      ], where: { permissionName: permissionName } });
      return result; 
    } catch (error) {
      console.error(error);
      return null ;
    } 
  }


  
  async function getPermissions() {
    try {
      const result = await PermissionRepository.findAll();
      return result; 
    } catch (error) {
      console.error(error);
      return null ;
    } 
  }







  

  module.exports = {
    fetchPermissionsByRoleId,getPermissionName,getPermissionId,getPermissionIdThen,getPermissions
};

