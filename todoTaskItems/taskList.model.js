const mongoose = require("mongoose");
const schema = mongoose.Schema;
const taskListSchema = new schema({

    taskItem:{type:String,require:true},
    DueDate :{type:Date,require:false},
    isDon:{type:String, require:false, default:false},
    reference:{type:mongoose.Types.ObjectId ,require:true},
    refUserId:{type:mongoose.Types.ObjectId ,require:true}


},{ timestamps: true });
const taskList = mongoose.model("todoTaskList",taskListSchema);
module.exports.taskList =taskList;