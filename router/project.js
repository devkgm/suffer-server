const app = require("express")();
const router = require("express").Router();
const db = require("../service/db");
const { verifyToken } = require("../module/tokenManager");

router.post("/", async (req, res) => {
    try {
        const { name } = req.body;

        const insertQuery = `INSERT INTO "PROJECT" (NAME) VALUES ($1) RETURNING *`;
        const values = [name];
        const result = await db.query(insertQuery, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("프로젝트 생성 중 오류 발생:", error);
        res.status(500).json({ error: "프로젝트 생성 중 오류 발생" });
    }
});

// 모든 프로젝트 조회 API (GET)
router.get("/", async (req, res) => {
    try {
        const selectQuery = `SELECT P.*
                            FROM "PROJECT" P
                            JOIN "MEMBER_PROJECT" MP ON P."ID" = MP."PROJECT_ID"
                            JOIN "MEMBER" M ON MP."MEMBER_ID" = M."MEMBER_ID"
                            WHERE M."MEMBER_ID" = 1`;

        const result = await db.query(selectQuery);

        res.json(result.rows);
    } catch (error) {
        console.error("프로젝트 조회 중 오류 발생:", error);
        res.status(500).json({ error: "프로젝트 조회 중 오류 발생" });
    }
});

module.exports = router;
