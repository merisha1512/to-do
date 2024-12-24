const { task } = require("../todoTask/task.model");
const repository = require("../todoTask/task.repository");
const taskRepository = require("../todoTaskItems/taskList.repository")
const { taskList } = require("../todoTaskItems/taskList.model");

const pagination = async( page,limit, userId)=>{

    //const taskData = repository.findAllTask(userId)

    const startIndex = (page-1)*limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await task.countDocuments()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }

    try {
        results.results = await repository.findAllTask(userId, limit,startIndex)
       return   results
        
      } catch (error) {
throw(error.message)  
    }

};
const TaskItemPagination = async( page,limit, id)=>{

  //const taskData = repository.findAllTask(userId)

  const startIndex = (page-1)*limit
  const endIndex = page * limit

  const results = {}

  if (endIndex < await taskList.countDocuments()) {
    results.next = {
      page: page + 1,
      limit: limit
    }
  }
  
  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    }
  }

  try {
      results.results = await taskRepository.findAllTaskItemById(id, limit,startIndex)
     return   results
      
    } catch (error) {
throw(error.message)  
  }

};
module.exports ={pagination,TaskItemPagination}