
const jwt = require("jsonwebtoken");
const { user } = require("../users/user.mode");
const AppError = require("../error/Apperror");
const repository = require("../authentication/auth.repository");

exports.userAuthVerification = async (req, res, next) => {
    try {
      let Token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
        Token = req.headers.authorization.split(" ")[1];
      if (!Token) return next(new AppError("you must login....", 401));
  
      // verify the access Token it's there in the db
      const checkTokenExist = await repository.isAccessTokenExist(Token);
      if (!checkTokenExist)
        return next(new AppError(" not a existing access token in the DB ", 401));
  
      // verify the Token and it's valid or not
      let decoded = jwt.verify(Token, process.env.JWT_SECRET);
      console.log(decoded);
         console.log(decoded.id)
         req.userId = decoded.id 
      // check the user is exist or not
      const currentUser = await user.findById(decoded.id);
      if (!currentUser) {
        return next(new AppError(" not a existing user", 401));
      }
      next();
    } catch (error) {
      console.log(error.message);
      return next(new AppError("please login again", 401));
    }
  };

 
  