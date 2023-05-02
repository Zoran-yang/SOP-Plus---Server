const validateUser = require("./validateUser");

const handleGet = (req, res, db) => {
  const { id, requestInfo } = req.body;

  // user info checking
  if (!id) {
    return res.status(400).json("Activity : getTaskInfos", "blank signin info");
  }
  if (!validateUser.handleValidate(id)) {
    return res.status(400).json("Activity : getTaskInfos", "wrong login Info");
  }

  console.log("requestInfo", requestInfo);
  // according to requestedType, getting task info
  switch (requestInfo.requestType) {
    case "taskTypes":
      db("tasktypes")
        .select("tasktype")
        .then((data) => {
          //get all tasktypes
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Activity : getTaskInfos", "system error");
        });
      break;
    case "taskNames":
      db("tasknames")
        .select("taskname")
        .where({ tasktype: requestInfo.taskType })
        .then((data) => {
          //get tasknames by tasktype
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Activity : getTaskInfos", "system error");
        });
      break;
    case "taskTags":
      db("tasktags")
        .select("tasktag")
        .then((data) => {
          //get all tasktags
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Activity : getTaskInfos", "system error");
        });
      break;
    case "taskSOP":
      const originalDataJsonb = JSON.stringify(requestInfo.taskTags);
      db("tasksops")
        .whereRaw(
          "tasktag::jsonb @> ?::jsonb AND jsonb_array_length(tasktag::jsonb) = jsonb_array_length(?::jsonb)",
          [originalDataJsonb, originalDataJsonb]
        )
        .andWhere({
          tasktype: requestInfo.taskType,
          taskname: requestInfo.taskName,
        })
        .then((data) => {
          //get tasknames by tasktype
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Activity : getTaskInfos", "system error");
        });
      break;
    case "AllTaskTypes":
      db("tasktypes")
        .returning("*")
        .then((data) => {
          //get tasknames by tasktype
          console.log("AllTaskTypes", data);
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Activity : getTaskInfos", "system error");
        });
      break;
    case "AllTaskNames":
      db("tasknames")
        .returning("*")
        .then((data) => {
          //get tasknames by tasktype
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Activity : getTaskInfos", "system error");
        });
      break;
    case "AllTaskTags":
      db("tasktags")
        .returning("*")
        .then((data) => {
          //get tasknames by tasktype
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Activity : getTaskInfos", "system error");
        });
      break;
    case "AllTaskSOP":
      db("tasksops")
        .returning("*")
        .then((data) => {
          //get tasknames by tasktype
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Activity : getTaskInfos", "system error");
        });
      break;
  }
};

module.exports = { handleGet: handleGet };
