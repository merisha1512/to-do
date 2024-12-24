const { taskList } = require("./taskList.model");
const repository = require("./taskList.repository");
const middleware = require("../middleware/userCheck.middleWare")
const itemPagination = require("../helpers/helper.paginate")

const getAllTaskItem = async (req, res) => {
  try {
    const Tasks = await repository.findAllTaskItem();
    res.status(200).send(Tasks);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const getAllTaskItemById = async (req, res) => {
  try {
    const id = req.params.id
    const userId = req.userId;
    const pageNumber = parseInt(req.query.page);
    const pageSize = parseInt(req.query.limit);

    const  check = await middleware.checkUser(id, userId);

    if(check === true){
    const Tasks = await itemPagination.TaskItemPagination(pageNumber,pageSize,id);
    res.status(200).send(Tasks);
  }
  else  return res.status(400).send("You are not a valid user");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const getAllTaskItemCount = async (req, res) => {
  try {
    const Tasks = await repository.findAllTaskItem();
    res.status(200).send(Tasks);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const getTaskItemById = async (req, res) => {
  const id = req.params.id;
  try {
    const userId = req.userId;
    const  check = await middleware.check(id, userId);

    if(check === true){
    const Task = await repository.findTaskItemById(id);
    if (!Task) {
      res.status(404).send("Data Not Found");
    } else {
      res.status(200).send(Task);
    }
  }
  else  return res.status(400).send("You are not a valid user");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const createTaskItem = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    const  check = await middleware.checkUser(id, userId);

    if(check === true){
    const newTask = new taskList({
      reference:id,
      taskItem: req.body.taskItem,
      DueDate: req.body.DueDate,
      refUserId :userId
    });
    const saveTask = await repository.createTaskItem(newTask);
    console.log(saveTask);
    if (saveTask) {
      console.log("Task saved successfully");
      return res.status(201).send(saveTask);
    } else {
      console.log("User not saved");
      return res.status(400).send("Error saving Task");
    }
  }
  else{
    console.log("error")
     return res.status(400).send("You are not a valid user");
  }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const updateTaskItem = async (req, res) => {
  
  try {
    const id = req.params.id;
    const userId = req.userId;
    const  check = await middleware.check(id, userId);
    if(check === true){
    const Task = await repository.findTaskItemById(id);
    if (Task) {
      const update = {
        taskItem: req.body.taskItem,
        DueDate: req.body.DueDate,
      };
      await repository.updateTaskItem(id, update);
      const Task = await repository.findTaskItemById(id);

      return res.status(200).send(Task);
    }
    res.status(404).send("Data Not found");
  }
  else  res.status(400).send("You are not a valid User");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const updateTaskStatus = async(req,res)=>{
  const id = req.params.id;
  try{
    const userId = req.userId;
    const  check = await middleware.check(id, userId);
    if(check === true){
    const Task = repository.findTaskItemById(id)
    if(Task){
      await repository.updateStatus(id);
      return res.status(200).send("status update")
    }
    else res.status(400).send("You are not a valid User");
    }
  }catch(error){
    console.log(error);
    return res.status(500).send(error);
  }
}


const deleteTaskItem = async (req, res) => {
  const id = req.params.id;
  try {
    const userId = req.userId;
    const  check = await middleware.check(id, userId);
    if(check === true){
    const Task = await repository.findTaskItemById(id);
    if (Task) {
      await repository.removeTaskItem(id);
      return res.status(200).send("DELETED");
    }
  }
  else res.status(400).send("You are not a valid User");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  getAllTaskItem,
  getAllTaskItemById,
  getAllTaskItemCount,
  getTaskItemById,
  createTaskItem,
  updateTaskItem,
  updateTaskStatus,
  deleteTaskItem,
};
