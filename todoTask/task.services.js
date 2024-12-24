const { task } = require("./task.model")
const repository = require("./task.repository")
const paginate = require("../helpers/helper.paginate")

const getAllTask = async (req,res,next)=>{
    try{
      console.log(req.userId)
      console.log(req.query)
      const pageNumber = parseInt(req.query.page);
      const pageSize = parseInt(req.query.limit);

   const paginateData =  await paginate.pagination(pageNumber, pageSize, req.userId)
       // const Users = await repository.findAllTask(req.userId)
        res.status(200).send(paginateData);
    }catch(error){
      console.log(error);
     return res.status(500).send(error);
    } 
};

const getAllTaskCount = async(req,res)=>{
  try {
    const Task = await repository.findTaskCount(req.userId)
    console.log(Task)
    res.status(200).send({Task: Task});
  } catch (error) {
    console.log(error);
     return res.status(500).send(error);
  }
}

const getAllTaskAndTaskItems = async(req,res)=>{
  try{
    const Users = await repository.findAllTaskAndItem(req.userId)
    res.status(200).send(Users);
}catch(error){
  console.log(error);
 return res.status(500).send(error);
}

}



const getTaskById = async(req,res)=> {
    const id = req.params.id
    try{
const User = await repository.findTaskByIdWithTaskItem(id);
     if(!User){
         res.status(404).send("Data Not Found");
        }else{
         res.status(200).send(User);
     }
    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
};

const createTask = async (req, res, next) => {
  try {
    const newTask = new task({
      userId:req.userId,
      task: req.body.task,
      description: req.body.description,
    });
    const saveTask = await repository.createTask(newTask);
    console.log(saveTask);
    if (saveTask) {
      console.log("User saved successfully");
      return res.status(201).send(saveTask);
    } else {
      console.log("User not saved");
      return res.status(400).send("Error saving User");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
  
};

const updateTask = async(req,res) =>{
    const id = req.params.id;
    try{
        const User = await repository.findTaskById(id);
        if(User){
            const update ={
                task: req.body.task,
                description: req.body.description,   
            }
            await repository.updateTask(id, update);
            const User = await repository.findTaskById(id);
           
          return res.status(200).send(User);
        }
        res.status(404).send("Data Not found");

    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
};

const deleteTask = async(req,res) =>{
    const id = req.params.id;
    try{
        const User = await repository.findTaskById(id);
        if(User){
        await repository.removeTask(id);
        return res.status(200).send("DELETED");
    }
    }catch(error){
      console.log(error);
      return   res.status(500).send(error);
    }
};

module.exports = {
  getAllTask,
  getAllTaskCount,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getAllTaskAndTaskItems,
};