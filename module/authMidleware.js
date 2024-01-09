const { generateToken, verifyToken } = require("./tokenManager");
const authMidleware = (req, res, next) => {
    console.log("미들웨어 실행");
    const accessToken = req.headers.authorization.split(",")[1];
    const refreshToken = req.headers.authorization.split(",")[0];
    const email = req.headers.email;
    console.log(accessToken, refreshToken, email);
    if (verifyToken(accessToken)) {
        next();
    } else {
        if (verifyToken(refreshToken)) {
            const accessToken = generateToken({ email: email });
        } else {
            res.status(401).json({ message: "AccessToken is invalid" });
        }
    }
};

module.exports = { authMidleware };
