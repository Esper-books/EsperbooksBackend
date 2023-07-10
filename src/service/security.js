const secretKey = "secret esperbook";
const jwt = require("jsonwebtoken");
var permissionRepositoryRef = require("../repo/permissionRepo");
var UserRolePermissionRepoRef = require("../repo/UserRolePermissionRepo");
var UserRoleRepositoryRef = require("../repo/userRoleRepo");

function authenticateToken(sreq, res, next) {
  const authHeader = sreq.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

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

// function authorizeRoles(privilege) {
//   return (req, res, next) => {
//     permissionRepositoryRef
//       .getPermissionIdThen(privilege)
//       .then((permissionId) => {
//         if (permissionId != null) {
//           UserRoleRepositoryRef.fetchUserRolesThen(req.user.id).then(
//             (userRoles) => {
//               if (userRoles != null) {
//                 for (const userRole of userRoles) {
//                   UserRolePermissionRepoRef.isExistPriviledge({
//                     userRoleId: userRole.id,
//                     permissionId: permissionId.id,
//                   }).then((isExist) => {
//                     if (isExist) {
//                       next();
//                     }
//                   });
//                 }
//                 //return res.sendStatus(403);
//               } else {
//                 return res.sendStatus(403);
//               }          
//             }
            
//           );
//         } else {
//           return res.sendStatus(403);
//         }
//       });
//   };
// }


function authorizeRoles(privilege) {
  return async (req, res, next) => {
    try {
      const permissionId = await permissionRepositoryRef.getPermissionIdThen(privilege);
      
      if (permissionId != null) {
        const userRoles = await UserRoleRepositoryRef.fetchUserRolesThen(req.user.id);
        
        if (userRoles != null) {
          for (const userRole of userRoles) {
            const isExist = await UserRolePermissionRepoRef.isExistPriviledge({
              userRoleId: userRole.id,
              permissionId: permissionId.id,
            });
            
            if (isExist) {
              next();
              return; // Exit the loop and the function
            }
          }
          
          res.sendStatus(403); // No matching user role found
        } else {
          res.sendStatus(403); // User roles not found
        }
      } else {
        res.sendStatus(403); // Permission ID not found
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Internal server error
    }
  };
}




function processOnboardingUserRole(sreq, res, next) {
  const companyToken = sreq.query.companyToken;

  if (companyToken == null) {
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

function processOnboardingUserRole(sreq, res, next) {
  const companyToken = sreq.query.companyToken;

  if (companyToken == null) {
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
  authenticateToken,
  authorizeRoles,
  processOnboardingUserRole,
};
