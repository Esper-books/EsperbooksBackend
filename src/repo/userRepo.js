const UserRepository = require("../model/user.js");
userRepoIns = new UserRepository();


function createUser(req) {
  try {
    return userRepoIns.userRepository.create(req).then((res) => {
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


  async function fetchUserByEmail(emailAddress, callback) {
    try {
      const result = await userRepoIns.userRepository.findOne({ where: { emailAddress: emailAddress } });
      console.log("result ::"+result);
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }

  async function fetchUserByPassword(password, callback) {
    try {
      const result = await userRepoIns.userRepository.findOne({ where: { password: password } });
      console.log("result ::"+result);
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }


  async function  fetchUserByUserPassword(detail, callback) {
    try {
      const result = await userRepoIns.userRepository.findOne({ where: { password: detail.password , emailAddress : detail.email } });
      console.log("result ::"+result);
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }


  async function updatePassword(detail,callback) {
    userRepoIns.userRepository.findOne({ where: { emailAddress: detail.email } })
    .then(user => {
      if (user) {
        user.update({ password: detail.newpassword });
      } else {
        throw new Error('Record not found');
      }
    })
    .then(updatedUser => {
      // Step 4: Handle the update result
      const result = updatedUser;
      callback(result);
    })
    .catch(error => {
      console.error('Error updating record:', error);
    });
  }




  

  module.exports = {
    createUser,
    fetchUserByEmail,
    fetchUserByPassword,
    updatePassword,
    fetchUserByUserPassword
};


