const { ObjectId } = require("mongodb");

const id = new ObjectId();

const strId = id.toString();

console.log(id == strId);