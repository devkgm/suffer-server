const app = require("express")();
const router = require("express").Router();
const { refreshToken } = require("firebase-admin/app");
const { signIn } = require("../service/firebase");

router.post("/", async (req, res) => {
    const email = req.body.email;
    const pwd = req.body.password;
    console.log(req.body);
    const [user, refreshToken, accessToken, info] = await signIn(email, pwd);
    console.log({
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
        info: info,
    });
    res.status(200).json({
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
        info: info,
    });
});

module.exports = router;
