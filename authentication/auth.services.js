const { token } = require("./auth.model");
const repository = require("./auth.repository");
const jwt = require("../helpers/helper.newToken");
//const decode = require("jsonwebtoken");
const decode = require("../helpers/helper.decode")
const sendMail = require("../helpers/helper.nodeMailer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const idCreate = require("../helpers/helper. idGenerator");
const AppError = require("../error/Apperror");
const { user } = require("../users/user.mode");


const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    
    const checkUser = await repository.checkUserEmail(email);
    if ( !checkUser )
      return next(
        new AppError(
          "wrong  email  please give a valid email  ",
          401
        )
      );

    const passwordCompare =  await bcrypt.compare(password,checkUser.password,);
console.log(passwordCompare)
    if ( passwordCompare === false)
      return next(
        new AppError(
          "wrong  Password  please give a valid  password ",
          401
        )
      );

    const accessId = idCreate.accessIdCreate();
    const refreshId = idCreate.refreshIdCreate();

    const accessToken = jwt.createNewAccessToken(checkUser._id, "accessToken");
    const refreshToken = jwt.createNewRefreshToken(
      checkUser._id,
      "refreshToken"
    );

    // saving the data
    const newAccessToken = new token({
      _id: accessId,
      reference: refreshId,
      token: accessToken,
      type: "accessToken",
    });
    const saveToken = await repository.createToken(newAccessToken);

    const newRefreshToken = new token({
      _id: refreshId,
      reference: accessId,
      token: refreshToken,
      type: "refreshToken",
    });
    const saveRefreshToken = await repository.createToken(newRefreshToken);
    return res
      .status(200)
      .setHeader("access", accessToken)
      .setHeader("refresh", refreshToken)
      .json({
        message: "login successfully",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

const tokenRefresh = async (req, res, next) => {
  try {
    const RefreshToken = req.headers.refresh;
    if (!RefreshToken)
      return next(new AppError("refresh token is required", 401));

    const checkRefreshTokenExist = await repository.isRefreshTokenExist(
      RefreshToken,
      "refreshToken"
    );
    if (!checkRefreshTokenExist)
      return next(new AppError(" not a existing refreshToken in the DB ", 401));

    const refreshTokenDetails = checkRefreshTokenExist.reference;
 const decodedRefreshToken = await decode.TokenDecode(RefreshToken);
    // const decodedRefreshToken = decode.verify(
    //   RefreshToken,
    //   process.env.JWT_SECRET
    // );
    const userId = decodedRefreshToken;

    const User = await user.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
    if (!User) return next(new AppError(" not a existing user ", 401));

    await repository.deleteTokens(refreshTokenDetails);

    const accessId = idCreate.accessIdCreate();
    const refreshId = idCreate.refreshIdCreate();

    const accessToken = jwt.createNewAccessToken(User._id, "accessToken");
    const refreshToken = jwt.createNewRefreshToken(
      User._id,
      "refreshToken"
    );

    // saving the data
    const newAccessToken = new token({
      _id: accessId,
      reference: refreshId,
      token: accessToken,
      type: "accessToken",
    });
    const saveToken = await repository.createToken(newAccessToken);

    const newRefreshToken = new token({
      _id: refreshId,
      reference: accessId,
      token: refreshToken,
      type: "refreshToken",
    });
    const saveRefreshToken = await repository.createToken(newRefreshToken);
    return res
      .status(200)
      .setHeader("access", accessToken)
      .setHeader("refresh", refreshToken)
      .json({
        message: "refreshing successfully",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

const logout = async (req, res, next) => {
  try {
    let Token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      Token = req.headers.authorization.split(" ")[1];
    if (!Token) return next(new AppError("you must login", 401));

    const checkTokenExist = await repository.isAccessTokenExist(Token);
    if (!checkTokenExist)
      return next(new AppError(" not a existing access token in the DB ", 401));

    const accessTokenDetails = checkTokenExist._id;
    const decodedToken = decode.verify(Token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const User = await user.findById({ _id: userId });
    if (!User)
      return next(new AppError(" not a existing access token in the DB ", 401));

    await repository.deleteTokens(accessTokenDetails);

    return res.status(200).send("logout successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

const changePassword = async (req, res, next) => {
  try {
    let Token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      Token = req.headers.authorization.split(" ")[1];
    if (!Token) return next(new AppError("you must login", 401));

    const checkTokenExist = await repository.isAccessTokenExist(Token);
    if (!checkTokenExist)
      return next(new AppError(" not a existing access token in the DB ", 401));

    const email = req.body.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const checkOldPassword = await repository.isEmailIsExists(email);
  
    const passwordCompare =  await bcrypt.compare(oldPassword, checkOldPassword.password);
   console.log(passwordCompare)
    if (passwordCompare=== false)
      return next(new AppError(" not a existing Old Password ", 401));

    const userNewPassword = await bcrypt.hash(newPassword, 12);
    await repository.passwordUpdate(checkOldPassword.email, userNewPassword);
    return res.status(200).send("passwordChanged");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

const forgotPassword = async (req,res,next) => {
  try {
    const email = req.body.email;
    const userEmail = await repository.checkUserEmail(email);
    if (!userEmail)
      return next(
        new AppError(
          `${email} is not a valid email* please provide the valid Email `,
          404
        )
      );
    const username = userEmail.name;
    const Token = jwt.createNewResetPassword(
      userEmail._id,
      "resetPasswordToken"
    );

    await sendMail.sendMail(email, username ,Token);
    const resetPasswordToken = new token({
      token: Token,
      type: "resetPasswordToken",
    });
    const saveToken = await repository.createToken(resetPasswordToken);
    res.status(200).json({
        message: " the reset password  token is sent",
        Token,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const ResetPasswordToken = req.query.token;
    if (!ResetPasswordToken)
      return next(new AppError(` reset token is required`, 404));

    const checkResetPasswordTokenExist =
      await repository.isResetPasswordTokenExist(
        ResetPasswordToken,
        "resetPasswordToken"
      );
    if (!checkResetPasswordTokenExist)
      return next(
        new AppError(" not a existing ResetPasswordToken in the DB ", 401)
      );

    const decodedResetPasswordToken = decode.verify(
      ResetPasswordToken,
      process.env.JWT_SECRET
    );
    const userId = decodedResetPasswordToken.id;

    const User = await user.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
    // console.log(User)
    if (!User) return next(new AppError(" not a existing user ", 401));

    const newPassword = req.body.newPassword;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await repository.updateNewPassword(User._id, hashedPassword);
    await repository.deleteResetToken(ResetPasswordToken);

    const accessId = idCreate.accessIdCreate();
    const refreshId = idCreate.refreshIdCreate();

    const accessToken = jwt.createNewAccessToken(User._id, "accessToken");
    const refreshToken = jwt.createNewRefreshToken(User._id, "refreshToken");

    // saving the data
    const newAccessToken = new token({
      _id: accessId,
      reference: refreshId,
      token: accessToken,
      type: "accessToken",
    });
    const saveToken = await repository.createToken(newAccessToken);

    const newRefreshToken = new token({
      _id: refreshId,
      reference: accessId,
      token: refreshToken,
      type: "refreshToken",
    });
    const saveRefreshToken = await repository.createToken(newRefreshToken);

    return res
      .status(200)
      .setHeader("Access", accessToken)
      .setHeader("refresh", refreshToken)
      .json({
        message: " New Tokens after reset the password",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

module.exports = { login ,tokenRefresh, logout ,changePassword,
                   forgotPassword, resetPassword};
