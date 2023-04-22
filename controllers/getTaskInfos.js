const validateUser = require("./validateUser");

const handleGet = (req, res, db) => {
  const { id, requestInfo } = req.body;

  // user info checking
  if (!id) {
    return res.status(400).json("blank signin info");
  }
  if (!validateUser.handleValidate(id)) {
    return res.status(400).json("wrong login Info");
  }

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
          res.status(400).json("system error");
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
          res.status(400).json("system error");
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
          res.status(400).json("system error");
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
          res.status(400).json("system error");
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
          res.status(400).json("system error");
        });
      break;
  }
};

module.exports = { handleGet: handleGet };
