const app = require("express")();
const router = require("express").Router();
const db = require("../service/db");
const { verifyToken } = require("../module/tokenManager");

//테스크 생성
router.post("/", async (req, res) => {
    const { name, description, projectId, ownerId } = req.body;
    const values = [name, description, projectId, ownerId];
    try {
        const insertQuery = `INSERT INTO "TASK" ("NAME", "DESCRIPTION", "PROJECT_ID", "OWNER_ID") VALUES ($1,$2,$3,$4) RETURNING *`;
        const result = await db.query(insertQuery, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("테스크 생성 중 오류 발생: ", error);
        res.status(500).json({ error: "테스크 생성 중 오류 발생" });
    }
});

//개별 테스크 조회
router.get("/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    const values = [taskId];
    try {
        const selectQuery = `SELECT T.*, (
                                SELECT json_agg(C.* ORDER BY C."CREATE_DT" ASC)
                                FROM "COMMENT" C
                                WHERE C."TASK_ID" = T."ID"
                            ) AS COMMENTS
                            FROM "TASK" T
                            WHERE T."ID" = $1;         
                            `;

        const result = await db.query(selectQuery, values);
        res.json(result.rows);
    } catch (error) {
        console.error("프로젝트 조회 중 오류 발생:", error);
        res.status(500).json({ error: "프로젝트 조회 중 오류 발생" });
    }
});

//테스크 수정
router.put("/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    const { name, description, projectId, ownerId } = req.body;
    const values = [name, description, projectId, ownerId, taskId];
    try {
        const updateQuery = `UPDATE "TASK" SET "NAME"=$1, "DESCRIPTION"=$2, "PROJECT_ID"=$3, "OWNER_ID"=$4 WHERE "ID" = $5 RETURNING *`;
        const result = await db.query(updateQuery, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: " 테스크를 찾을 수 없습니다." });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error("테스크 수정 중 오류 발생: ", error);
        res.status(500).json({ error: "테스크 수정 중 오류 발생" });
    }
});

//테스크 삭제
router.delete("/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    const values = [taskId];
    try {
        const deleteQuery = `UPDATE "TASK" SET "IS_DELETED"=true WHERE "ID" = $1 RETURNING *`;
        const result = await db.query(deleteQuery, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: " 테스크를 찾을 수 없습니다." });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error("테스크 삭제 중 오류 발생: ", error);
        res.status(500).json({ error: "테스크 삭제 중 오류 발생" });
    }
});

module.exports = router;
