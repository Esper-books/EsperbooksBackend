
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

      async function removeUsedToken(token){
        resetPasswordRepoIns.resetPasswordRepository.destroy({
          where: {
            token: token, // Specify the condition to match the record you want to delete
          },
        })
          .then(deletedCount => {
            if (deletedCount > 0) {
              console.log('Token removed');
            } else {
              console.log('No token found to remove');
            }
          })
          .catch(error => {
            console.error('Error removing token:', error);
          });
      }


      async function removeUsedTokenWithEmail(email){
        resetPasswordRepoIns.resetPasswordRepository.destroy({
          where: {
            email: email, // Specify the condition to match the record you want to delete
          },
        })
          .then(deletedCount => {
            if (deletedCount > 0) {
              console.log('Token removed');
            } else {
              console.log('No token found to remove');
            }
          })
          .catch(error => {
            console.error('Error removing token:', error);
          });
      }
    



  module.exports = {
    fetchResetPByToken,
    createResetPassword,
    updatePassword,
    removeUsedToken,
    removeUsedTokenWithEmail
};

