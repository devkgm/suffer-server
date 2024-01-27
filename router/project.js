const app = require("express")();
const router = require("express").Router();
const db = require("../service/db");
const { verifyToken } = require("../module/tokenManager");
const { authMidleware } = require("../module/authMidleware");
const { projectId } = require("../service/config");

router.use(authMidleware);

//add
router.post("/", async (req, res) => {
    try {
        const { title, owner_id, description, members } = req.body;

        await db.query("BEGIN");

        const insertProjectQuery = `INSERT INTO "PROJECT" ("TITLE", "OWNER_ID","DESCRIPTION") VALUES ($1, $2, $3) RETURNING *`;
        const projectValues = [title, owner_id, description];
        const projectResult = await db.query(insertProjectQuery, projectValues);

        const insertMemberProjectQuery = `INSERT INTO "MEMBER_PROJECT" ("MEMBER_ID", "PROJECT_ID") VALUES ($1, $2) RETURNING *`;
        const memberProjectValues = [owner_id, projectResult.rows[0].ID];
        const memberProjectResult = await db.query(
            insertMemberProjectQuery,
            memberProjectValues
        );
        for (let i = 0; i < members.length; i++) {
            const insertMemberProjectQuery = `INSERT INTO "MEMBER_PROJECT" ("MEMBER_ID", "PROJECT_ID") VALUES ($1, $2) RETURNING *`;
            const memberProjectValues = [members[i], projectResult.rows[0].ID];
            const memberProjectResult = await db.query(
                insertMemberProjectQuery,
                memberProjectValues
            );
        }

        await db.query("COMMIT");

        res.status(201).json(projectResult.rows[0]);
    } catch (error) {
        console.error("프로젝트 생성 중 오류 발생:", error);
        await db.query("ROLLBACK");
        res.status(500).json({ error: "프로젝트 생성 중 오류 발생" });
    }
});

//전체 프로젝트 리스트
router.get("/list/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const values = [userId];

        const selectQuery = `SELECT P.*, (
                                            SELECT COUNT("ID") 
                                            FROM "MEMBER_PROJECT" MMP 
                                            WHERE P."ID" = MMP."PROJECT_ID"
                                            ) AS MEMBER
                                          
                            FROM "PROJECT" P
                            JOIN "MEMBER_PROJECT" MP ON P."ID" = MP."PROJECT_ID"
                            JOIN "MEMBER" M ON MP."MEMBER_ID" = M."ID"
                            WHERE M."ID" = $1 AND P."IS_DELETED" != true
                            ORDER BY P."CREATE_DT" ASC;
                            `;

        const result = await db.query(selectQuery, values);

        res.json(result.rows);
    } catch (error) {
        console.error("프로젝트 조회 중 오류 발생:", error);
        res.status(500).json({ error: "프로젝트 조회 중 오류 발생" });
    }
});
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

//프로젝트 삭제
router.delete("/:projectId", async (req, res) => {
    try {
        const projectId = req.params.projectId;
        console.log(projectId);
        const deleteQuery = `UPDATE "PROJECT" SET "IS_DELETED"=true WHERE "ID" = $1 RETURNING *`;
        const values = [projectId];
        const result = await db.query(deleteQuery, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: " 프로젝트를 찾을 수 없습니다." });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error("프로젝트 삭제 중 오류 발생: ", error);
        res.status(500).json({ error: "프로젝트 삭제 중 오류 발생" });
    }
});
module.exports = router;
