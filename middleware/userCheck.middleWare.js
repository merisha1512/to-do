const taskRepository = require("../todoTask/task.repository");
const taskItemRepository = require("../todoTaskItems/taskList.repository");
const  checkUser = async(id,user)=>{

    const check = await taskRepository.findTaskById(id);
    const User = String(check.userId);
    const UserId = user;
    if(User === UserId){
        return true
    }
    else return false

}

const check = async (id, user)=>{
     const find = await  taskItemRepository.findTaskItemById(id);
     const User = String(find.refUserId);
     const UserId = user;
     if(User === UserId){
         return true
     }
     else return false
}
module.exports={checkUser, check}