"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../../config/default");
function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.status(401).json('No valid authentication credentials.'); // if there isn't any token
    const hash = crypto.createHmac('sha256', config.secret)
        .update('This esperbook application secret')
        .digest('hex');
    jwt.verify(token, hash, (err, user) => {
        if (err)
            return res.status(403).json('Unauthorized access');
        req.user = user;
        next(); // pass the execution off to whatever request the client intended
    });
}
exports.authenticateToken = authenticateToken;
