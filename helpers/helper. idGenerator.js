const { ObjectId } = require("mongodb");

const accessIdCreate = () => {
  const accessId = new ObjectId();
  return accessId;
};

const refreshIdCreate = () => {
  const refreshId = new ObjectId();
  return refreshId;
};

module.exports = { accessIdCreate, refreshIdCreate };
