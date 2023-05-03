const handleRevise = (req, res, db) => {
  let { id, revisedInfo } = req.body;
  // user info checking
  if (!id) {
    return res
      .status(400)
      .json("Activity : reviseTaskInfos", "blank signin info");
  }
  if (id !== "zoran") {
    res.status(400).json("Activity : reviseTaskInfos", "wrong login Info");
  }
  console.log("revisedInfo", revisedInfo);

  // according to requestedType, getting task info
  switch (revisedInfo.requestType) {
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
    case "taskNames":
      //update tasknames
      db("tasknames")
        .where({
          id: revisedInfo.id,
        })
        .update({
          taskname: JSON.stringify(revisedInfo.taskName),
        })
        .returning("*")
        .then((data) => {
          //get tasknames by tasktype
          console.log("taskNames", "data", data);
          res.json(data);
        })
        .catch((err) => {
          if (err.code === "23505") {
            return;
          }
          console.log(err);
          res.status(400).json("system error");
        });
      //update the tasknames of tasksops which taskname is revised
      db("tasksops")
        .where({
          taskname: revisedInfo.taskName,
        })
        .update({
          taskname: JSON.stringify(revisedInfo.taskName),
        })
        .catch((err) => {
          if (err.code === "23505") {
            return;
          }
          console.log(err);
        });
      //update the tasknames of taskdetails which taskname is revised
      db("taskdetails")
        .where({
          taskname: revisedInfo.taskName,
        })
        .update({
          taskname: JSON.stringify(revisedInfo.taskName),
        })
        .catch((err) => {
          if (err.code === "23505") {
            return;
          }
          console.log(err);
        });
      break;
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
      const originalDataJsonb = JSON.stringify(revisedInfo.taskTag);
      db("tasksops")
        .whereRaw(
          //check if the tasktags already exist
          "tasktag::jsonb @> ?::jsonb AND jsonb_array_length(tasktag::jsonb) = jsonb_array_length(?::jsonb)",
          [originalDataJsonb, originalDataJsonb]
        )
        .andWhere({
          // and check if the task is the same as the original one
          tasktype: revisedInfo.taskType,
          taskname: revisedInfo.taskName,
        })
        .then((data) => {
          if (
            data.length === 0 || //no such task
            (data.length && data[0].sopid === revisedInfo.sopId) //the task is the same as the original one
          ) {
            //no such task or the task is the same as the original one
            //The reason why I don't use constraint in database is that tasktag is a array,
            //db can't tell the difference, so unique constraint will not work.
            db("tasksops")
              .where({ sopid: revisedInfo.sopId })
              .update({
                sop: JSON.stringify(revisedInfo.sop),
                tasktype: JSON.stringify(revisedInfo.taskType),
                taskname: JSON.stringify(revisedInfo.taskName),
                tasktag: JSON.stringify(revisedInfo.taskTag),
              })
              .returning("*")
              .then((data) => {
                res.json(data);
              })
              .catch((err) => {
                console.log(err);
                res
                  .status(400)
                  .json("Activity : reviseTaskInfos", "system error");
              });
          } else {
            //task already exist
            res
              .status(400)
              .json("This SOP already exist, please revise SOP informaton");
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Activity : reviseTaskInfos", "system error");
        });
      break;
  }
};

module.exports = { handleRevise: handleRevise };
