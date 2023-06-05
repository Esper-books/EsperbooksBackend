
const ResetPasswordRepository = require('../model/resetPasswordToken');

resetPasswordRepoIns = new ResetPasswordRepository();

  async function fetchResetPByToken(token, callback) {
    try {
      const result = await resetPasswordRepoIns.resetPasswordRepository.findOne({ where: { token: token } });
      console.log("result ::"+result);
      callback(result);
    } catch (error) {
      console.error(error);
    } 
  }


  function createResetPassword(req) {
    try {
      return resetPasswordRepoIns.resetPasswordRepository.create(req).then((res) => {
        return res;
      });
    }catch(error){
      return res
        .status(500)
        .json({ responseCode: 500, responseMessage: "Server Error" });
    }
    }


    async function updatePassword(detail) {
        resetPasswordRepoIns.resetPasswordRepository.findOne({ order: [['createdAt', 'DESC']],where: { email: detail.email } })
        .then(user => {
          if (user) {
            return user.update({ password: detail.newpassword });
          } else {
            throw new Error('Record not found');
          }
        })
        .catch(error => {
          console.error('Error updating record:', error);
        });
      }
    



  module.exports = {
    fetchResetPByToken,
    createResetPassword,
    updatePassword
};

