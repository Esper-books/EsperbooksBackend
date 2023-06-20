const RoleRepository = require("../model/role.js");
roleRepoIns = new RoleRepository();
const UserRole  = new require("../model/UserRole");






  async function fetchRoleNamebyUser(userId, callback) {
    try {
      const result = await UserRole.userRoleRepository.findOne({ where: { userId: userId } });
      console.log("result ::"+result);
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }

  async function fetchRoles(userId, callback) {
    try {
      const result = await UserRole.userRoleRepository.findAll({ where: { userId: userId } });
      console.log("result ::"+result);
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }


  function AddRoleToUser(req) {
    try {
      return UserRole.userRoleRepository.create(req).then((res) => {
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




  module.exports = {
    fetchRoleNamebyUser,AddRoleToUser,fetchRoles
};


