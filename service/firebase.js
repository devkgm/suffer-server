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
        const resultSet = await db.query(selectQuery, values);
        const result = resultSet.rows[0];
        const responseData = {
            id: result.ID,
            email: result.EMAIL,
            company_id: result.COMPANY_ID,
            name: result.NAME,
            refreshToken: refreshToken,
            accessToken: accessToken,
            uid: user.uid,
        };
        return responseData;
    } catch (error) {
        console.error("로그인 실패:", error.code, error.message);
        return false;
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
