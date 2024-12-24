const jwt = require("jsonwebtoken");
const TokenDecode =async (token)=>{

    const decode = jwt.verify(token,process.env.JWT_SECRET)
    console.log(decode.id)
    return decode.id;
};
module.exports={TokenDecode}