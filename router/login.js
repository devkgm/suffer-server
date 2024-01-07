const app = require("express")();
const router = require("express").Router();
const { refreshToken } = require("firebase-admin/app");
const { signIn } = require("../service/firebase");

router.post("/", async (req, res) => {
    const email = req.body.email;
    const pwd = req.body.password;
    console.log(req.body);
    const responseData = await signIn(email, pwd);
    if (responseData != false) {
        res.status(200).json(responseData);
    } else {
        res.status(500).send();
    }
});

module.exports = router;
