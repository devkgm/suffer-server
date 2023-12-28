const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const login = require("./router/login");
const project = require("./router/project");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 인증
app.use("/login", login);

//project
app.use("/projects", project);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
