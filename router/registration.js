const app = require("express")();
const router = require("express").Router();
const { refreshToken } = require("firebase-admin/app");
const { registration, signIn } = require("../service/firebase");

router.post("/", async (req, res) => {
    const email = req.body.email;
    const pwd = req.body.password;
    console.log(req.body);
    const result = await registration(email, pwd);
    if (result) {
        const [user, refreshToken, accessToken] = await signIn(email, pwd);
        res.status(200).json({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } else {
        res.status(400);
    }
});

module.exports = router;
