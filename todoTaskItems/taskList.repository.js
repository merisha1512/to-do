const mongoose = require("mongoose");
const { taskList } = require("./taskList.model");

const findAllTaskItem = async () => {
  return await taskList.find( );
};
const findAllTaskItemById = async(id,limit,startIndex)=>{
//return await taskList.find({reference:new mongoose.Types.ObjectId(id)})
const response = await taskList.find({ reference: new mongoose.Types.ObjectId(id)})
.skip(startIndex)
.limit(limit);
const totalCount = await taskList.find({ reference: new mongoose.Types.ObjectId(id)})
const result ={};
result.docs =response;
result.count = totalCount.length;
return result;

}

const findTaskItemById = async (id) => {
  return await taskList.findOne({ _id: new mongoose.Types.ObjectId(id) });
};

const createTaskItem = async (newTask) => {
  return await newTask.save();
};

const updateTaskItem = async (id, update) => {
  return await taskList.findOneAndUpdate({ _id: id }, update);
};

const updateStatus = async(id)=>{
  return await taskList.findOneAndUpdate({_id:id},{isDon:true})
}

const removeTaskItem = async (id) => {
  return await taskList.deleteOne({ _id: id });
};

module.exports = {
  findAllTaskItem,
  findAllTaskItemById,
  findTaskItemById,
  createTaskItem,
  updateTaskItem,
  updateStatus,
  removeTaskItem,
};
