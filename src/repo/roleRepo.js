RoleRepository = require("../model/role");
UserRoleRepository  = require("../model/UserRole");


  async function fetchRoleNamebyUser(userId, callback) {
    try {
      const result = await UserRoleRepository.findOne({ where: { userId: userId } });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }

  async function fetchRoles(userId, callback) {
    try {
      console.log(userId) ; 
      const result = await UserRoleRepository.findAll({ where: { userId: userId } });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }


  function AddRoleToUser(req) {
    try {
      return UserRoleRepository.create(req).then((res) => {
        return res;
      });
    }catch(error){
      if (error.name === 'SequelizeUniqueConstraintError') {
        // Handle the duplicate error
        const value = error.errors[0].value;
        if (error) return res.status(400).json(    
          {responseMessage:`${value} already exist.`});
      } else {
        // Handle other errors
         console.error(error);
      }
      return res
        .status(500)
        .json({ responseCode: 500, responseMessage: "Server Error" });
    }
    }

    async function fetchRoleByRoleName(name) {
      try {
        return RoleRepository.findOne({ where: { name: name } });
        //callback(result);
      } catch (error) {
        console.error(error);
      } 
    }


    async function fetchAllRoles() {
      try {
        return await RoleRepository.findAll();
      } catch (error) {
        console.error(error);
      } 
    }

    async function getAssignedRoles(userId , callback) {
      const query = `
      SELECT Roles.name as roleName
      FROM UserRoles
      INNER JOIN Roles ON UserRoles.roleId = Roles.id
      WHERE UserRoles.userId = :userId 
        `;
    
      try {
        const results = await sequelize.query(query, {
          type: QueryTypes.SELECT,
          replacements: { 
            userId: userId
          },
        });
        callback(results);
      } catch (error) {
        console.error("Error executing query:", error);
      }
    }

    async function updateUserRoles(req) {
      try {
        return UserRoleRepository.create(req).then((res) => {
          return res;
        });
      }catch(error){
        if (error.name === 'SequelizeUniqueConstraintError') {
          // Handle the duplicate error
          const value = error.errors[0].value;
          if (error) return res.status(400).json(    
            {responseMessage:`${value} already exist.`});
          return {};
        } else {
          // Handle other errors
           console.error(error);
        }
      }
    }

    async function deleteUserRoleRecord(req) {
      try {
        const deletedUserRoleP = await UserRolesPermissionRepository.destroy({
          where: {
            userId: req.userId,
            roleId: req.roleId
          }
        });
    
        console.log(`${deletedUserRoleP} record(s) deleted successfully.`);
      } catch (error) {
        console.error('Error deleting record(s):', error);
      }
    }




  module.exports = {
    fetchRoleNamebyUser,AddRoleToUser,fetchRoles,fetchRoleByRoleName,fetchAllRoles,updateUserRoles,getAssignedRoles,deleteUserRoleRecord
};


