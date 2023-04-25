const handleDelete = (req, res, db) => {
  let { id, deletedInfo } = req.body;
  // user info checking
  if (!id) {
    return res.status(400).json("blank signin info");
  }
  if (id !== "zoran") {
    res.status(400).json("wrong login Info");
  }

  // according to requestedType, getting task info
  switch (deletedInfo.requestType) {
    // case "taskTypes":
    //   db("tasktypes").insert({tasktype : JSON.stringify(updatedInfo.taskType)})
    //   .returning("*")
    //   .then((data) => { //get all tasktypes
    //     res.json(data);
    //   }).catch((err)=>{
    //     console.log(err.code)
    //     if (err.code === "23505") {
    //       return
    //     }
    //     res.status(400).json("system error")
    //   })
    //   break;
    // case "taskNames":
    //   db("tasknames").insert({
    //     tasktype : JSON.stringify(updatedInfo.taskType),
    //     taskname : JSON.stringify(updatedInfo.taskName)
    //   }).returning("*").then((data) => { //get tasknames by tasktype
    //     res.json(data);
    //   })
    //   .catch((err)=>{
    //     if (err.code === "23505") {
    //       return
    //     }
    //     console.log(err)
    //     res.status(400).json("system error")
    //   })
    //   break;
    // case "taskTags":
    //   db("tasktags").insert({
    //     tasktag : JSON.stringify(updatedInfo.TaskTag)
    //   }).returning("*").then((data) => { //get all tasktags
    //     res.json(data);
    //   })
    //   .catch((err)=>{
    //     if (err.code === "23505") {
    //       return
    //     }
    //     console.log(err)
    //     res.status(400).json("system error")
    //   })
    //   break;
    // case "taskContent":
    //   db("taskdetails").insert({
    //       tasktype : JSON.stringify(updatedInfo.taskType),
    //       taskname : JSON.stringify(updatedInfo.taskName),
    //       tasktag : JSON.stringify(updatedInfo.taskTag),
    //       taskdetail : JSON.stringify(updatedInfo.taskContent),
    //       detailid : JSON.stringify(updatedInfo.detailId)
    //     }).returning("*").then((data) => { //get all tasktags
    //     res.json(data);
    //   })
    //   .catch((err)=>{
    //     if (err.code === "23505") {
    //       return
    //     }
    //     console.log(err)
    //     res.status(400).json("system error")
    //   })
    //   break;
    case "TaskSOP":
      db("tasksops")
        .where({
          sopid: deletedInfo.sopId,
        })
        .returning("*")
        .del()
        .then((data) => {
          console.log(data);
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("SOP is not deleted");
        });
      break;
  }
};

module.exports = { handleDelete: handleDelete };
