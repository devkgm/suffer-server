const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const { Pool } = require("pg");
const login = require("./router/login");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 인증
app.use("/login", login);

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

pool.connect();
// 모든 회사 조회
app.get("/companies", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "COMPANY"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 특정 회사 조회
app.get("/companies/:id", async (req, res) => {
    const companyId = req.params.id;
    try {
        const result = await pool.query(
            'SELECT * FROM "COMPANY" WHERE "ID" = $1',
            [companyId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 새로운 회사 추가
app.post("/companies", async (req, res) => {
    const { name, owner } = req.body;
    let date = Date.now();
    try {
        const result = await pool.query(
            'INSERT INTO "COMPANY" ("NAME", "OWNER") VALUES ($1, $2) RETURNING *',
            [name, owner]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 회사 정보 업데이트
app.put("/companies/:id", async (req, res) => {
    const companyId = req.params.id;
    const { name, owner } = req.body;
    try {
        const result = await pool.query(
            'UPDATE "COMPANY" SET "NAME" = $1,  "OWNER" = $2 WHERE "ID" = $3 RETURNING *',
            [name, owner, companyId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 회사 삭제
app.delete("/companies/:id", async (req, res) => {
    const companyId = req.params.id;
    try {
        await pool.query('DELETE FROM "COMPANY" WHERE "ID" = $1', [companyId]);
        res.status(204).json();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// MEMBER 테이블에 대한 라우트 및 CRUD 작업
app.get("/members", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "MEMBER"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/members/:id", async (req, res) => {
    const memberId = req.params.id;
    try {
        const result = await pool.query(
            'SELECT * FROM "MEMBER" WHERE "MEMBER_ID" = $1',
            [memberId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/members", async (req, res) => {
    const { name, email, company_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO "MEMBER" ("NAME", "EMAIL", "COMPANY_ID") VALUES ($1, $2, $3) RETURNING *',
            [name, email, company_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/members/:id", async (req, res) => {
    const memberId = req.params.id;
    const { name, email, company_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE "MEMBER" SET "NAME" = $1, "EMAIL" = $2, "COMPANY_ID" = $3 WHERE "MEMBER_ID" = $4 RETURNING *',
            [name, email, company_id, memberId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/members/:id", async (req, res) => {
    const memberId = req.params.id;
    try {
        const result = await pool.query(
            'DELETE FROM "MEMBER" WHERE "MEMBER_ID" = $1',
            [memberId]
        );
        res.status(204).json();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
