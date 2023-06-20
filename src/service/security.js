const secretKey = "secret esperbook";
const jwt = require("jsonwebtoken");
var userRepository = require("../repo/userRepo");
var permissionRepository = require("../repo/permissionRepo");
var roleRepository = require("../repo/roleRepo");

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
  
      req.user = user;

      next();
    });
  }
  

  function authorizeRoles(priviledges) {
    return (req, res, next) => {

        roleRepository.fetchRoles(req.user.id , (roleResp) => {
            var permissions = [];
          if (roleResp != null){
             rolesIds = roleResp.forEach((i) =>         
              {
                
                permissionRepository.fetchPermissionsByRoleId(i.roleId)
                  .forEach(p =>{
                  permissionRepository.getPermissionName(p.id, (r) => {
                    if (r != null) permissions.push(r.name) ; 
                  });
                });
              
              }
              
              );
              if (!permissions.includes(priviledges)) {
                return res.sendStatus(403);
              }
                next();
         
          }
          return res.sendStatus(403);
          });

           
         
    };
  }

//   permissionRepository.fetchPermissionsByRoleId(roleResp.id, (permsResp) => {
//     permissions = permsResp.map(p => p.permissionName);
//   if (!permissions.includes(priviledges)) {
//     return res.sendStatus(403);
//   }
//   next()
// }) ; 


  
  module.exports = {
    authenticateToken,authorizeRoles
};