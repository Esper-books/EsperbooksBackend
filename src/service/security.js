const secretKey = "secret esperbook";
const jwt = require("jsonwebtoken");
var permissionRepositoryRef = require("../repo/permissionRepo");
var roleRepository = require("../repo/roleRepo");

function authenticateToken(sreq, res, next) {
    const authHeader = sreq.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
  
      sreq.user = user;

      next();
    });
  }
  

  // async function authorizeRoles(priviledges) {
  //   return (req, res, next) => {
  //     var permissions = [];
  //       roleRepository.fetchRoles(req.user.id , (roleResp) => {
  //         if (roleResp != null){
  //            rolesIds = roleResp.forEach((i) =>         
  //             {
                 
  //              permissionRepositoryRef.fetchPermissionsByRoleId(i.roleId , (prrr) =>{
  //                 prrr.forEach(p =>{
  //                   permissionRepositoryRef.getPermissionName(p.permissionsId, (r) => {
  //                     if (r != null) permissions.push(r.permissionName) ; 
  //                   });
  //                 }).then(() => {
  //                   console.log(permissions);
  //                   if (!permissions.includes(priviledges)) {
  //                     return res.sendStatus(403);
  //                   }
  //                   next();

  //                 });
                 
  //               })
  //               ;    
  //             }
            
  //             );
  //         }
  //         else return res.sendStatus(403);
  //         });

  

           
         
  //   };
  // }


  function authorizeRoles(priviledges) {
    return (sreq, res, next) => {
      var permissions = [];
      roleRepository.fetchRoles(sreq.user.id, (roleResp) => {
        if (roleResp != null) {
          var rolePromises = roleResp.map((i) => {
            return new Promise((resolve, reject) => {
              permissionRepositoryRef.fetchPermissionsByRoleId(i.roleId, (prrr) => {
                var permissionPromises = prrr.map((p) => {
                  return new Promise((resolve, reject) => {
                    permissionRepositoryRef.getPermissionName(p.permissionsId, (r) => {
                      if (r != null) permissions.push(r.permissionName);
                      resolve();
                    });
                  });
                });
  
                Promise.all(permissionPromises)
                  .then(() => {
                    resolve();
                  })
                  .catch((err) => {
                    reject(err);
                  });
              });
            });
          });
  
          Promise.all(rolePromises)
            .then(() => {
              console.log(permissions);
              if (!permissions.includes(priviledges)) {
                return res.sendStatus(403);
              }
              next();
            })
            .catch((err) => {
              return res.sendStatus(403);
            });
        } else {
          return res.sendStatus(403);
        }
      });
    };
  }

  function processOnboardingUserRole(sreq, res, next) {
    const companyToken = sreq.query.companyToken ;

  
    if (companyToken == null ) {
      return res.sendStatus(401);
    }
  
    jwt.verify(companyToken, secretKey, (err, detail) => {
      if (err) {
        return res.sendStatus(403);
      }
      sreq.sDetail = detail;
      next();
  });

}
  

  
  module.exports = {
    authenticateToken,authorizeRoles,processOnboardingUserRole
};