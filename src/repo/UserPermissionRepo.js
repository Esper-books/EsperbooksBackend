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


  async function initiatePermissionsForUser(userId) {

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
             await UserPermissionRepository.bulkCreate(records);
            } catch (error) {
              console.error('Error inserting records into table C:', error);
            }

  }


  
  async function setDefaultPrivileges(req) {

    try {

      const permission = await PermissionRepository.findOne({
        where: { id: req.permissionId }
      }
      );
      if (permission !=null){
        req.status=true
        await UserPermissionRepository.update(req,{
            where: {userId : req.userId , permissionId : permission.id}
          })
      }

    } catch (error) {
      console.error('Error inserting records into table C:', error);
    }

}

async function processRoleDefaultPrivileges(req) {
 
    try {
        RoleRepositoryRef.fetchRoleByRoleName(req.roleName , (res) =>{
            if(res != null){
            PermissionRepositoryRef.fetchPermissionsByRoleId(res.dataValues.id , (resi) =>{
                if (resi != null ){
                    console.log(resi[0])
                    setDefaultPrivileges({userId : req.userId , permissionId :  resi[0].dataValues.permissionsId});
                }
            });     
        }
        });

    } catch (error) {
      console.error('Error inserting records into table C:', error);
    }

}


// async function processRoleDefaultPrivileges(req) {
//     try {
//       await sequelize.transaction(async (transaction) => {
//         const role = await RoleRepositoryRef.fetchRoleByRoleName(req.roleName);
//         console.log(role);
        
//         const permissions = await PermissionRepositoryRef.fetchPermissionsByRoleId(role.dataValues.id);
//         await setDefaultPrivileges({ userId: req.userId, permissionId: permissions.dataValues.id }, { transaction });
//       });
//     } catch (error) {
//       console.error('Error inserting records into table C:', error);
//     }
//   }


  



  module.exports = {
    fetchPermissions,initiatePermissionsForUser,setDefaultPrivileges,processRoleDefaultPrivileges
};

