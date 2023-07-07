const { QueryTypes } = require('sequelize');
const UserRolesPermissionRepository = require("../model/UserRolesPermissions");
const RoleRepository = require("../model/role");
PermissionRepository = require("../model/permission.js");
RoleRepositoryRef = require("./roleRepo");
PermissionRepositoryRef = require("./permissionRepo");
UserRoleRef = require("../repo/userRoleRepo");


async function fetchPermissions(userRoleId, callback) {
    try {
      const result = await UserRolesPermissionRepository.findAll({ 
        include: [{ model: Permissions }],
        where: { userRoleId: userRoleId } ,
        raw: true
    });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }





  async function initiatePermissionsForUser(userId) {
    try {
      const records = [];
  
      const userRoles = await new Promise((resolve, reject) => {
        UserRoleRef.fetchUserRoles(userId, (userRoles) => {
          if (userRoles.length > 0) {
            resolve(userRoles);
          } else {
            reject(new Error('Failed to fetch user roles'));
          }
        });
      });
  
      for (const userRole of userRoles) {
        const permissions = await new Promise((resolve, reject) => {
          PermissionRepositoryRef.fetchPermissionsByRoleId(userRole.roleId, (permissions) => {
            if (permissions.length > 0) {
              resolve(permissions);
            } else {
              reject(new Error('Failed to fetch permissions'));
            }
          });
        });
  
        for (const permission of permissions) {
          const newRecord = {
            permissionId: permission.permissionsId,
            userRoleId: userRole.id 
          };
          records.push(newRecord);
        }
      
      }
  

      await UserRolesPermissionRepository.bulkCreate(records);
    } catch (error) {
      console.error('Error in initiatePermissionsForUser:', error);
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
         UserRoleRef.fetchUserRole({userId: req.userId,roleId: req.roleId} , (userRole) => {
          UserRolesPermissionRepository.update(req,{
            where: {userRoleId : userRole.id , permissionId : permission.id}
          })

        });
    
      }

    } catch (error) {
      console.error('Error setDefaultPrivileges:', error);
    }

}

async function processRoleDefaultPrivileges(req) {
      const role = await RoleRepositoryRef.fetchRoleByRoleName(req.roleName);
            if (role != null){
              var req = {userId : req.userId , roleId : role.dataValues.id};
              await UserRoleRepositoryRef.AddRoleToUser(req);
            } else {console.log('specified role to be added not available')}
    
  initiatePermissionsForUser(req.userId)
    try {
            if(role != null){
              PermissionRepositoryRef.fetchPermissionsByRoleId(role.dataValues.id , (permissionIds) =>{
                if (permissionIds != null ){
                    permissionIds.forEach( permissionId => {
                      setDefaultPrivileges({userId : req.userId , permissionId :  permissionId.dataValues.permissionsId
                        , roleId : role.dataValues.id});
                    });          
                }
            });  
     
        }


    } catch (error) {
      console.error('Error processRoleDefaultPrivileges', error);
    }

}


async function isExistPriviledge (req) {
    try {
      const record = await UserRolesPermissionRepository.findOne({
        where: {
          userRoleId: req.userRoleId,
          permissionId: req.permissionId,
          status: true
        }
      });

      const exists = !!record;
      //callback(exists) ; 
      return exists; 
    } catch (error) {
      console.error('Error:', error);
    }
  };


  async function getUserRolePermissions(userRoleId,callback) {
    const query = `
      SELECT UserRolePermissions.status, Permissions.permissionName as name
      FROM UserRolePermissions
      INNER JOIN Permissions ON UserRolePermissions.permissionId = Permissions.id
      WHERE UserRolePermissions.userRoleId = :userRoleId
    `;
    
    try {
      const results = await sequelize.query(query, { type: QueryTypes.SELECT,
        replacements: { userRoleId }  });
      callback(results);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  }


  
  async function getUserRolePermissionsThen(userRoleId) {
    const query = `
      SELECT UserRolesPermissions.status, Permissions.permissionName as permissionName
      FROM UserRolesPermissions
      INNER JOIN Permissions ON UserRolesPermissions.permissionId = Permissions.id
      WHERE UserRolesPermissions.userRoleId = :userRoleId
    `;
    
    try {
      const results = await sequelize.query(query, { type: QueryTypes.SELECT,
        replacements: { userRoleId }  });
     return results ;
    } catch (error) {
      console.error('Error executing query:', error);
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
    fetchPermissions,initiatePermissionsForUser,setDefaultPrivileges,processRoleDefaultPrivileges,isExistPriviledge,getUserRolePermissions,getUserRolePermissionsThen
};

