const express = require("express");
const router = express.Router();
const AppError = require("../error/Apperror");
const globalErrorController = require("../error/errorControl");
const inputValidation = require("./user.inputValidation");
const service = require("./user.services");

router.get("/getAllUser", service.getAllUser);
router.post(
  "/CreateUser",
  inputValidation.createUserInputValidation,
  service.createUser
);
router.get(
  "/getUserById/:id",
  inputValidation.userIdInputValidation,
  service.getUserById
);
router.put(
  "/updateUserById/:id",
  inputValidation.updateUserInputValidation,
  service.updateUser
);

router.delete(
  "/deleteUserById/:id",
  inputValidation.userIdInputValidation,
  service.deleteUser
);
router.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} in the server`, 404));
});
router.use(globalErrorController);

module.exports = router;
