const app = require("express")();
const router = require("express").Router();
const db = require("../service/db");
const { verifyToken } = require("../module/tokenManager");
const { authMidleware } = require("../module/authMidleware");

router.use(authMidleware);

//개별 프로젝트
router.get("/:projectId", async (req, res) => {
    const projectId = req.params.projectId;
    const values = [projectId];
    try {
        const selectQuery = `SELECT T.*, (
                                SELECT json_agg(C.* ORDER BY C."CREATE_DT" DESC)
                                FROM "COMMENT" C
                                WHERE C."TASK_ID" = T."ID"
                                LIMIT 2
                            ) AS COMMENTS
                            FROM "TASK" T
                            JOIN "PROJECT" P ON T."PROJECT_ID" = P."ID"
                            WHERE P."ID" = $1 AND T."IS_DELETED" != true
                            ORDER BY T."CREATE_DT" DESC;         
                            `;

        const result = await db.query(selectQuery, values);
        res.json(result.rows);
    } catch (error) {
        console.error("프로젝트 조회 중 오류 발생:", error);
        res.status(500).json({ error: "프로젝트 조회 중 오류 발생" });
    }
});

module.exports = router;
