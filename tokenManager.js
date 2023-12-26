// tokenManager.js

const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET; // 비밀 키, 실제 환경에서는 안전하게 관리해야 합니다.
const options = {
    expiresIn: "1h", // 토큰의 유효 기간, 필요에 따라 조절 가능
};
const refreshOptions = {
    expiresIn: "30d", // 리프레시 토큰의 유효 기간
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
        return null;
    }
}

module.exports = { generateToken, generateRefreshToken, verifyToken };
