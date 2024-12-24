const express = require("express");
const authRouter = express.Router();
const globalErrorController = require("../error/errorControl");
const service = require("./auth.services");
const AppError = require("../error/Apperror")
const inputValidation = require("./auth.inputValidation");

authRouter.post("/login", inputValidation.userLogin, service.login);
authRouter.post("/refresh", service.tokenRefresh);
authRouter.delete("/logout", service.logout);
authRouter.post(
  "/forgotPassword",
  inputValidation.forgotPassword,
  service.forgotPassword
);
authRouter.patch(
  "/resetPassword",
  inputValidation.resetPassword,
  service.resetPassword
);
authRouter.patch(
  "/changePassword",
  inputValidation.changePassword,
  service.changePassword
);

authRouter.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} in the server`, 404));
});
authRouter.use(globalErrorController);
module.exports = authRouter;
