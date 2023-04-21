function handleValidate(id) {
  console.log("id: ", id);
  console.log(id !== "zoran");
  if (id !== "zoran") {
    return false;
  }
  return true;
}

module.exports = { handleValidate };
