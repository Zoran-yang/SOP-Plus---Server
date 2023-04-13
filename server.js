const express = require('express');
// const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
// const handleRegister = require("./controller/register.js")
// const handleSignin = require("./controller/signin.js")
// const handleProfile = require("./controller/profile.js")
// const handleImage = require("./controller/Image.js")
const path = require('path');

const app = express();

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'sopplus'
  }
});

//監聽使用者需求
let PORT = process.env.PORT;
if (PORT == null || PORT === "") {
  PORT = 3000;
}


app.listen(PORT, () => {
  console.log(`Server is working!!!!!!!!!`)
})

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

//解析使用者需求
app.use(express.json());
// 跨網域需求(讓撰寫者可以在瀏覽器上測試全端專案)
app.use(cors());

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//使用者行為 : get users's data || 對應網路行為 : post || 結果 : 返回user資料
app.post("/getTaskInfos", (req, res) => {
  const {id, requestInfo} = req.body
  // user info checking
  if (!id) {return res.status(400).json("blank signin info")}
  const isVaild = id === "zoran"
  if (!isVaild){res.status(400).json("wrong login Info")}

  // according to requestedType, getting task info
  switch (requestInfo.requestType) {
    case "taskTypes":
      db("tasktypes").select("tasktype").then((data) => { //get all tasktypes
        res.json(data);
      }).catch((err)=>{
        console.log(err)
        res.status(400).json("system error")
      })
      
      break;
    case "taskNames":
      db("tasknames").select("taskname").where(requestInfo.taskType).then((data) => { //get tasknames by tasktype
        res.json(data);
      })
      .catch((err)=>{
        console.log(err)
        res.status(400).json("system error")
      })
      break;
    case "taskTags":
      db("tasktags").select("tasktag").then((data) => { //get all tasktags
        console.log(data)
        res.json(data);
      })
      .catch((err)=>{
        console.log(err)
        res.status(400).json("system error")
      })
      break;
  }
});


app.patch("/updateTaskInfos", (req, res) => {
  const {id, updatedInfo} = req.body
  // user info checking
  if (!id) {return res.status(400).json("blank signin info")}
  const isVaild = id === "zoran"
  if (!isVaild){res.status(400).json("wrong login Info")}
  console.log("updatedInfo",updatedInfo)

  // according to requestedType, getting task info
  switch (updatedInfo.requestType) {
    case "taskTypes":
      db("tasktypes").insert({tasktype : JSON.stringify(updatedInfo.taskType)}).returning("*").then((data) => { //get all tasktypes
        res.json(data);
      }).catch((err)=>{
        console.log(err)
        res.status(400).json("system error")
      })
      break;
    case "taskNames":
      db("tasknames").insert({tasktype : JSON.stringify(updatedInfo.taskType),taskName : JSON.stringify({title: updatedInfo.taskName})}).returning("*").then((data) => { //get tasknames by tasktype
        res.json(data);
      })
      .catch((err)=>{
        console.log(err)
        res.status(400).json("system error")
      })
      break;
    case "taskTags":
      db("tasktags").insert({tasktag : JSON.stringify(updatedInfo.TaskTag)}).returning("*").then((data) => { //get all tasktags
        res.json(data);
      })
      .catch((err)=>{
        console.log(err)
        res.status(400).json("system error")
      })
      break;
  }
});

// //使用者行為 : signin || 對應網路行為 : get || 結果 : 顯示成功或失敗
// app.post('/signin', (req, res) => {handleSignin.handleSignin(req, res, bcrypt, db)});

// //使用者行為 : Register || 對應網路行為 : post || 結果 : 傳輸user資料
// app.post("/register", (req, res) => {handleRegister.handleRegister(req, res, bcrypt, db)});

// //使用者行為 : get users's own page || 對應網路行為 : get || 結果 : 返回user資料
// app.get("/profile/:id", (req, res) => {handleProfile.handleProfile(req, res, db)});

// //使用者行為 : update 辨識圖片同時在database中更新辨識圖片的次數 || 對應網路行為 : put || 結果 : 更新使用者辨識圖片的次數
// app.put("/image", (req, res) => {handleImage.handleImage(req, res, db)});

// //使用者行為 : 取得辨識圖片資料 || 對應網路行為 : put || 結果 : 更新使用者辨識圖片的次數
// app.post("/imageAPI", (req, res) => {handleImage.getImageAPI(req, res)});



