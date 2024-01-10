const app = require("express")();
const router = require("express").Router();
const db = require("../service/db");
const { verifyToken } = require("../module/tokenManager");
const { authMidleware } = require("../module/authMidleware");

router.use(authMidleware);

//개별 프로젝트
router.get("/members/:company_id", async (req, res) => {
    const { company_id } = req.params;
    const values = [company_id];
    try {
        const selectQuery = `SELECT * FROM "MEMBER" WHERE "COMPANY_ID" = $1 `;

        const result = await db.query(selectQuery, values);
        res.json(result.rows);
    } catch (error) {
        console.error("프로젝트 조회 중 오류 발생:", error);
        res.status(500).json({ error: "프로젝트 조회 중 오류 발생" });
    }
});

module.exports = router;
