const handleUpdate = (req, res, db) => {
  let { id, updatedInfo } = req.body;
  // user info checking
  if (!id) {
    return res.status(400).json("blank signin info");
  }
  if (id !== "zoran") {
    res.status(400).json("wrong login Info");
  }

  // according to requestedType, getting task info
  switch (updatedInfo.requestType) {
    case "taskTypes":
      db("tasktypes")
        .insert({ tasktype: JSON.stringify(updatedInfo.taskType) })
        .returning("*")
        .then((data) => {
          //get all tasktypes
          console.log(data);
          res.json(data);
        })
        .catch((err) => {
          if (err.code === "23505") {
            return;
          }
          console.log(err);
          res.status(400).json("system error");
        });
      break;
    case "taskNames":
      db("tasknames")
        .insert({
          tasktype: JSON.stringify(updatedInfo.taskType),
          taskname: JSON.stringify(updatedInfo.taskName),
        })
        .returning("*")
        .then((data) => {
          //get tasknames by tasktype
          res.json(data);
        })
        .catch((err) => {
          if (err.code === "23505") {
            return;
          }
          console.log(err);
          res.status(400).json("system error");
        });
      break;
    case "taskTags":
      db("tasktags")
        .insert({
          tasktag: JSON.stringify(updatedInfo.TaskTag),
        })
        .returning("*")
        .then((data) => {
          //get all tasktags
          res.json(data);
        })
        .catch((err) => {
          if (err.code === "23505") {
            return;
          }
          console.log(err);
          res.status(400).json("system error");
        });
      break;
    case "taskContent":
      db("taskdetails")
        .insert({
          tasktype: JSON.stringify(updatedInfo.taskType),
          taskname: JSON.stringify(updatedInfo.taskName),
          tasktag: JSON.stringify(updatedInfo.taskTag),
          taskdetail: JSON.stringify(updatedInfo.taskContent),
          detailid: JSON.stringify(updatedInfo.detailId),
        })
        .returning("*")
        .then((data) => {
          //get all tasktags
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("system error");
        });
      break;
    case "TaskSOP":
      const originalDataJsonb = JSON.stringify(updatedInfo.taskTag);
      db("tasksops")
        .whereRaw(
          "tasktag::jsonb @> ?::jsonb AND jsonb_array_length(tasktag::jsonb) = jsonb_array_length(?::jsonb)",
          [originalDataJsonb, originalDataJsonb]
        )
        .andWhere({
          tasktype: updatedInfo.taskType,
          taskname: updatedInfo.taskName,
        })
        .then((data) => {
          if (data.length === 0) {
            //no such task
            //The reason why I don't use constraint in database is that tasktag is a array,
            //so unique constraint will not work.
            db("tasksops")
              .insert({
                tasktype: JSON.stringify(updatedInfo.taskType),
                taskname: JSON.stringify(updatedInfo.taskName),
                tasktag: JSON.stringify(updatedInfo.taskTag),
                sop: JSON.stringify(updatedInfo.sop),
                sopid: JSON.stringify(updatedInfo.sopId),
              })
              .returning("*")
              .then((data) => {
                //get all tasktags
                res.json(data);
              })
              .catch((err) => {
                if (err.code === "23505") {
                  return;
                }
                console.log(err);
                res.status(400).json("system error");
              });
          } else {
            //task already exist
            res
              .status(400)
              .json("SOP already exist, please revise your SOP infomation");
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("system error");
        });
      break;
  }
};

module.exports = { handleUpdate: handleUpdate };
