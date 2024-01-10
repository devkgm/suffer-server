const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const login = require("./router/login");
const project = require("./router/project");
const task = require("./router/task");
const comment = require("./router/comment");
const member = require("./router/member");
const company = require("./router/company");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 인증
app.use("/login", login);

//project
app.use("/projects", project);

//member
app.use("/members", member);
//company
app.use("/company", company);

//TASK
app.use("/tasks", task);

//COMMENT
app.use("/comments", comment);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
