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

function authorizeRoles(privilege) {
  return (req, res, next) => {
    permissionRepositoryRef
      .getPermissionIdThen(privilege)
      .then((permissionId) => {
        if (permissionId != null) {
          UserRoleRepositoryRef.fetchUserRolesThen(req.user.id).then(
            (userRoles) => {
              if (userRoles != null) {
                for (const userRole of userRoles) {
                  UserRolePermissionRepoRef.isExistPriviledge({
                    userRoleId: userRole.id,
                    permissionId: permissionId.id,
                  }).then((isExist) => {
                    if (isExist) {
                      next();
                    }
                  });
                }
              } else {
                res.sendStatus(403);
              }          
            }
            
          );
        } else {
          res.sendStatus(403);
        }
      });
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
