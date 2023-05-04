const handleDelete = (req, res, db) => {
  let { id, deletedInfo } = req.body;
  // user info checking
  if (!id) {
    return res.status(400).json("Activity : delTaskInfos", "blank signin info");
  }
  if (id !== "zoran") {
    res.status(400).json("Activity : delTaskInfos", "wrong login Info");
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
    case "taskNames":
      //delete tasknames
      db("tasknames")
        .where({
          id: deletedInfo.id,
        })
        .returning("*")
        .del()
        .then((data) => {
          console.log("taskNames", "data", data);
          //delete the tasknames of tasksops which taskname is deleted
          db("tasksops")
            .where({
              taskname: data.taskName,
            })
            // not detele the taskname of taskdetails, just set it to ""
            .update({
              taskname: "",
            })
            .catch((err) => {
              if (err.code === "23505") {
                return;
              }
              console.log(err);
            });
          //delete the tasknames of taskdetails which taskname is revised
          db("taskdetails")
            .where({
              taskname: data.taskName,
            })
            // not detele the taskname of taskdetails, just set it to ""
            .update({
              taskname: "",
            })
            .catch((err) => {
              if (err.code === "23505") {
                return;
              }
              console.log(err);
            });
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Task name is not deleted");
        });

      break;
    case "taskTags":
      db("tasktags")
        .where({
          id: deletedInfo.id,
        })
        .returning("*")
        // .del()
        .then((data) => {
          //delete the tasktag of tasksops which tasktag is deleted
          const originalDataJsonb = JSON.stringify([
            JSON.parse(data[0].tasktag),
          ]);
          const originalTitle = JSON.parse(data[0].tasktag).title;
          db("tasksops")
            .whereRaw("tasktag::jsonb @> ?::jsonb", [originalDataJsonb])
            .update("tasktag", function () {
              this.select(db.raw("jsonb_agg(elems.value)"))
                .from(
                  db.raw(
                    "jsonb_array_elements(tasktag::jsonb) WITH ORDINALITY as elems(value)"
                  )
                )
                .whereNot(
                  db.raw("elems.value ->> ? = ?", ["title", originalTitle])
                );
            })
            .catch((err) => {
              if (err.code === "23505") {
                return;
              }
              console.log(err);
            });

          //delete the tasktag of taskdetails which tasktag is revised
          db("taskdetails")
            .where({
              tasktag: data[0].tasktag,
            })
            // detele whole row
            .del()
            .catch((err) => {
              if (err.code === "23505") {
                return;
              }
              console.log(err);
            });
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Task tag is not deleted");
        });
      break;
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
