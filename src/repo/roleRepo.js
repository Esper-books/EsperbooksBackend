RoleRepository = require("../model/role");
UserRoleRepository  = require("../model/UserRole");


  async function fetchRoleNamebyUser(userId, callback) {
    try {
      const result = await UserRoleRepository.findOne({ where: { userId: userId } });
      console.log("result ::"+result);
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }

  async function fetchRoles(userId, callback) {
    try {
      const result = await UserRoleRepository.findAll({ where: { userId: userId } });
      console.log("result ::"+result);
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

    async function fetchRoleByRoleName(name, callback) {
      try {
        const result = await RoleRepository.findOne({ where: { name: name } });
        console.log("result ::"+result);
        callback(result);
      } catch (error) {
        console.error(error);
      } 
    }




  module.exports = {
    fetchRoleNamebyUser,AddRoleToUser,fetchRoles,fetchRoleByRoleName
};

