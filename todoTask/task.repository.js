const mongoose = require("mongoose");
const { task } = require("./task.model");
const { taskList } = require("../todoTaskItems/taskList.model");
const AppError = require("../error/Apperror");

const findAllTask = async (id, limit, startIndex) => {
  const response = await task
    .find({ userId: new mongoose.Types.ObjectId(id) })
    .skip(startIndex)
    .limit(limit); 
    const totalCount = await task .find({userId: new mongoose.Types.ObjectId(id)});
    const result = {};
    result.docs = response;
    result.count = totalCount.length;
  return result;
};
const findTaskCount = async (id) => {
  return await task.countDocuments({ userId: new mongoose.Types.ObjectId(id) });
};

const findAllTaskAndItem = async (id) => {
  const pipeline = [
    { $match: { userId: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "todotasklists",
        localField: "_id",
        foreignField: "reference",
        as: "items",
      },
    },
  ];
  return await task.aggregate(pipeline);
};

const findTaskById = async (id) => {
  return await task.findOne({ _id: new mongoose.Types.ObjectId(id) });
};

const findTaskByIdWithTaskItem = async (id) => {
  const pipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "todotasklists",
        localField: "_id",
        foreignField: "reference",
        as: "items",
      },
    },
  ];
  return await task.aggregate(pipeline);
};

const createTask = async (newTask) => {
  return await newTask.save();
};

const updateTask = async (id, update) => {
  return await task.findOneAndUpdate({ _id: id }, update);
};

const removeTask = async (id) => {
  //     await task.deleteOne({_id:id});
  //   await taskList.deleteMany({reference:id})
  // return "delete"

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("session:", session);
    console.log("id:", id);
    const tasks = await task.findOne({ _id: id }).session(session);
    const reference = await taskList
      .findOne({ reference: id })
      .session(session);
    await task.deleteOne({ _id: id }).session(session);
    await taskList.deleteOne({ reference: id }).session(session);
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();

    session.endSession();
  }
};

module.exports = {
  findAllTask,
  findTaskCount,
  findTaskById,
  createTask,
  updateTask,
  removeTask,
  findTaskByIdWithTaskItem,
  findAllTaskAndItem,
};
