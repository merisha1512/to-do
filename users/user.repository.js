const mongoose = require("mongoose");
const { user } = require("./user.mode");


// find all users

const findAllUsers = async()=>{
    return await user.find({$and:[{isDelete:false}]} );
};

const findUserById = async(id)=>{
    return await user.findOne({_id: new mongoose.Types.ObjectId(id)});
};

const createUser = async(newUser)=>{
return await newUser.save();
};

const isEmailIsExist = async(email)=>{
 const users = await user.findOne({email:email})
 if(users) return true
 return false
}

const update = async(id, updateUser)=>{
return await user.findOneAndUpdate({_id:id}, updateUser);
};

const removeUser = async(id)=>{
    return await user.findOneAndUpdate({_id:id},{isDelete:true});
};

module.exports = {
    findAllUsers, findUserById,
    createUser, isEmailIsExist,update,
    removeUser
}


