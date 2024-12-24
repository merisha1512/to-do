const mongoose = require("mongoose")
const { user } = require("../users/user.mode");
const { token } = require("./auth.model");
const bcrypt= require("bcrypt");

const checkUserEmail = async(email)=>{
const userEmail =  await user.findOne({email:email}).select("+password");
if(userEmail)
return userEmail
return false
};

const createToken =async(newToken)=>{
    return await newToken.save();
};

const isRefreshTokenExist = async(refreshToken,type)=>{
 return  await token.findOne({token:refreshToken, type:type})
}

const deleteTokens = async(id)=>{
    return await token.deleteMany({$or:[{_id:id,},{reference:id}]})
}

const isAccessTokenExist =async(Token)=>{
    return await token.findOne({token:Token})
}

const isEmailIsExists = async(email)=>{
    return await user.findOne({email:email}).select("+password");

}

const passwordUpdate = async(email,newPassword)=>{
    
    return await user.findOneAndUpdate( {email:email},{password:newPassword} )
}

const isResetPasswordTokenExist = async(resetToken,type)=>{
    return await token.findOne({token:resetToken,type:type})
}

const updateNewPassword = async(id,password)=>{
 return await user.findOneAndUpdate({_id:id},{password:password})
}

const deleteResetToken = async(Token)=>{
    return await token.deleteOne({token:Token})

}
module.exports ={
   checkUserEmail,createToken,isRefreshTokenExist, deleteTokens
   ,isAccessTokenExist, isEmailIsExists, passwordUpdate, 
   isResetPasswordTokenExist, updateNewPassword, deleteResetToken
}
