// tokenManager.js

const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET;
const options = {
    expiresIn: "1h",
};
const refreshOptions = {
    expiresIn: "30d",
};

// 토큰 발급
function generateToken(payload) {
    return jwt.sign(payload, secretKey, options);
}

// 리프레시 토큰 발급
function generateRefreshToken(payload) {
    return jwt.sign(payload, secretKey, refreshOptions);
}

// 토큰 인증
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return false;
    }
}

module.exports = { generateToken, generateRefreshToken, verifyToken };
