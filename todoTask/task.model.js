const mongoose = require("mongoose");
const schema = mongoose.Schema;
const taskSchema = new schema({
    userId:{type:mongoose.Types.ObjectId,require:true},
    task:{type:String,require:true},
    description:{type:String, require:false},
    status:{type:String, require:false, default:"Active"}

},{ timestamps: true });
const task = mongoose.model("todoTasks",taskSchema);
module.exports.task =task;