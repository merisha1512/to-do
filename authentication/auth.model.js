const mongoose = require("mongoose");
const schema = mongoose.Schema;
const tokenSchema=  new schema({
    reference:{type:mongoose.Types.ObjectId, required:false},
     type: { type: String,enum:["accessToken","refreshToken","resetPasswordToken"], required:true},
     token: { type: String, required:true },
     expiresAt:{type:Date, required:false,default:null}
})
const token = mongoose.model("tokens",tokenSchema);
 module.exports.token = token;
