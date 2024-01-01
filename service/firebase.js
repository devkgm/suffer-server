const { initializeApp } = require("firebase/app");
const {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} = require("firebase/auth");

const firebaseConfig = require("./config");
const {
    generateToken,
    generateRefreshToken,
} = require("../module/tokenManager");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = require("../service/db");

const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        const payload = { email: user.email };
        const refreshToken = generateRefreshToken(payload);
        const accessToken = generateToken(payload);

        const selectQuery = `SELECT * FROM "MEMBER" WHERE "EMAIL" = $1`;
        const values = [user.email];
        const info = await db.query(selectQuery, values);
        return [user, refreshToken, accessToken, info.rows[0]];
    } catch (error) {
        console.error("로그인 실패:", error.code, error.message);
        return [null, null, null];
    }
};

const registration = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = { signIn, registration };
