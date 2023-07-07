UserRepository = require("../model/user.js");
RoleRepositoryRef = require("../repo/roleRepo");
UserRoleRepositoryRef = require("../repo/userRoleRepo");


function createUser(req) {
  try {
    return UserRepository.create(req);
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



  async function fetchUserByEmail(emailAddress, callback) {
    try {
      const result = await UserRepository.findOne({ where: { emailAddress: emailAddress } });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }

  async function fetchUserByPassword(password, callback) {
    try {
      const result = await UserRepository.findOne({ where: { password: password } });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }


  async function  fetchUserByUserPassword(detail,callback) {
    try {
      const result = await UserRepository.findOne({ where: { password: detail.password , emailAddress : detail.email } });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }


  async function updatePassword(detail) {
    UserRepository.findOne({ where: { emailAddress: detail.email } })
    .then(user => {
      if (user) {
        return user.update({ password: detail.newpassword });
      } else {
        throw new Error('Record not found');
      }
    })
    .then(updatedUser => {
      // Step 4: Handle the update result
      console.log('Step 4: Handle the update result');
      return updatedUser ;
    })
    .catch(error => {
      console.error('Error updating record:', error);
    });
  }


  async function fetchUserById(id, callback) {
    try {
      const result = await UserRepository.findOne({ where: { id: id } });
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }



  async function fetchCompanyEmailsByCompanyId(companyId,callback) {
    try {
      const result = await UserRepository.findAll({
        attributes: [
          [sequelize.literal('emailAddress'), 'email'] 
        ],
        where: {
          companyId: companyId
        }
      });
      callback(result);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  }


  async function fetchCompanyEmailsByCompanyIdByManagerStatic(companyId,callback) {
    try {
      const result = await UserRepository.findAll({
        attributes: [
          [sequelize.literal('emailAddress'), 'email'] 
        ],
        where: {
          companyId: companyId,
          isManager: true
        }
      });
      callback(result);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  }


  async function fetchUserByCompanyIdEmail(req,callback) {
    try {
      const result = await UserRepository.findOne({
        where: {
          companyId: req.companyId,
          emailAddress: req.email
        }
      });
      callback(result);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  }


  async function updateUserByAdmin(req,callback) {
    try {
      return callback(await UserRepository.update(req,{ where: { id:req.id } }));
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
    createUser,
    fetchUserByEmail,
    fetchUserByPassword,
    updatePassword,
    fetchUserByUserPassword,
    fetchUserById,
    fetchCompanyEmailsByCompanyId,
    fetchUserByCompanyIdEmail,
    updateUserByAdmin,
    fetchCompanyEmailsByCompanyIdByManagerStatic
};


