const jwt = require("jsonwebtoken");

const createNewAccessToken = (id,type)=>{

const accessToken = jwt.sign( { id: id, type:type},process.env.JWT_SECRET,
                              { expiresIn: process.env.JWT_EXPIRES_IN });
        return  accessToken
}
const createNewRefreshToken = (id,type)=>{
const refreshToken = jwt.sign({ id: id, type:type},process.env.JWT_SECRET,
                     { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN });
return refreshToken
}

const createNewResetPassword = (id,type)=>{
        const resetPasswordToken = jwt.sign({id:id , type:type},process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN});
     return resetPasswordToken           
}
module.exports ={createNewAccessToken, createNewRefreshToken ,createNewResetPassword}