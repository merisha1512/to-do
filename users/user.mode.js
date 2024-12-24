const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = new schema({
    name: { type: String, required: false },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false ,select : false},
    phone: { type: String, min: 10, max: 10, required:true },
    isDelete :{type:Boolean , default : false},
  },{ timestamps: true }
);
const user = mongoose.model("Users",userSchema);
module.exports.user =user;