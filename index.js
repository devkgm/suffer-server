const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const login = require("./router/login");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 인증
app.use("/login", login);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
