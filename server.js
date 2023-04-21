const express = require("express");
const cors = require("cors");
const knex = require("knex");
const path = require("path");
const updateTaskInfos = require("./controllers/updateTaskInfos");
const getTaskInfos = require("./controllers/getTaskInfos");
const reviseTaskInfos = require("./controllers/reviseTaskInfos");

const app = express();

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "",
    database: "sopplus",
  },
});

//監聽使用者需求
let PORT = process.env.PORT;
if (PORT == null || PORT === "") {
  PORT = 3000;
}

app.listen(PORT, () => {
  console.log(`Server is working!!!!!!!!!`);
});

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));

//解析使用者需求
app.use(express.json());
// 跨網域需求(讓撰寫者可以在瀏覽器上測試全端專案)
app.use(cors());

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//使用者行為 : get users's data || 對應網路行為 : post || 結果 : 返回user資料
app.post("/getTaskInfos", (req, res) => getTaskInfos.handleGet(req, res, db));

//使用者行為 : update Task Information || 對應網路行為 : patch || 結果 : transfer user Information
app.patch("/updateTaskInfos", (req, res) =>
  updateTaskInfos.handleUpdate(req, res, db)
);

//使用者行為 : revise original task information || 對應網路行為 : patch || 結果 : revise user Information
app.patch("/reviseTaskInfos", (req, res) =>
  reviseTaskInfos.handleRevise(req, res, db)
);
