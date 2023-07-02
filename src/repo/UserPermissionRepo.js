const UserPermissionRepository = require("../model/UserPermission");
const RoleRepository = require("../model/role");
PermissionRepository = require("../model/permission.js");
RoleRepositoryRef = require("../repo/roleRepo");
PermissionRepositoryRef = require("../repo/permissionRepo");

async function fetchPermissions(userId, callback) {
    try {
      const result = await UserPermissionRepository.findAll({ 
        include: [{ model: Permissions }],
        where: { userId: userId } ,
        raw: true
    });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }


  async function initiatePermissionsForUser(userId, callback) {

            try {

              const permissionIds = await PermissionRepository.findAll();
          
              const records = [];

              permissionIds.forEach((record) => {
                const newRecord = {
                  permissionId: record.id,
                  userId: userId 
                };
                records.push(newRecord);
              });
              const result = await UserPermissionRepository.bulkCreate(records);
              callback(result);
            } catch (error) {
              console.error('Error inserting records into table C:', error);
            }

  }


  
  async function setDefaultPrivileges(req, callback) {

    try {

      const permission = await PermissionRepository.findOne({
        where: { permissionName: req.name }
      }
      );
      const result = await UserPermissionRepository.update(req,{
        where: {userId : req.userId , permissionId : permission.id}
      })
      callback(result);
    } catch (error) {
      console.error('Error inserting records into table C:', error);
    }

}

async function processRoleDefaultPrivileges(req, callback) {

    try {
        RoleRepositoryRef.fetchRoleByRoleName(req.roleName , (res) =>{
            PermissionRepositoryRef.fetchPermissionsByRoleId(res.id , (resi) =>{
                 
            });
            

        });
        
        setDefaultPrivileges(req)
      

        
    } catch (error) {
      console.error('Error inserting records into table C:', error);
    }

}


  



  module.exports = {
    fetchPermissions,initiatePermissionsForUser,setDefaultPrivileges
};

