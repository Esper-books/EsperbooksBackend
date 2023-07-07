UserRoleRepository = require("../model/UserRole");

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

    async function fetchUserRoles(userId, callback) {
      try {
        const result = await UserRoleRepository.findAll({ where: { userId: userId } });
        callback(result);
      } catch (error) {
        console.error(error);
      } 
    }

    async function fetchUserRolesThen(userId) {
      try {
        const result = await UserRoleRepository.findAll({ where: { userId: userId } });
        return result; 
      } catch (error) {
        console.error(error);
      } 
    }



    
    async function fetchUserRole(req, callback) {
      try {
        const result = await UserRoleRepository.findOne({ where: { userId: req.userId , roleId: req.roleId } });
        callback(result);
      } catch (error) {
        console.error(error);
      } 
    }


    async function fetchUserRoleThen(req) {
      try {
        return await UserRoleRepository.findOne({ where: { userId: req.userId , roleId: req.roleId } });
      } catch (error) {
        console.error(error);
      } 
    }



  




module.exports = {
    AddRoleToUser,fetchUserRoles,fetchUserRole,fetchUserRolesThen,fetchUserRoleThen
};
