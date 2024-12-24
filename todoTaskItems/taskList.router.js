const express = require("express");
const router = express.Router();
const AppError = require("../error/Apperror");
const globalErrorController = require("../error/errorControl");
const inputValidation = require("./taskList.inputValidation");
const service = require("./taskList.services");
const authVerify = require("../middleware/auth.middleware");

router.get(
  "/getAllTaskItem",
  authVerify.userAuthVerification,
  service.getAllTaskItem
);
router.get(
  "/getAllTaskItemById/:id",
  authVerify.userAuthVerification,
  service.getAllTaskItemById
);

router.get(
  "/getTaskItemById/:id",
  authVerify.userAuthVerification,
  service.getTaskItemById
);
router.post(
  "/createTaskItem/:id",
  inputValidation.createTaskItemInputValidation,
  authVerify.userAuthVerification,
  service.createTaskItem
);
router.put(
  "/updateTaskItemById/:id",
  inputValidation.updateTaskIdemInputValidation,
  authVerify.userAuthVerification,
  service.updateTaskItem
);
router.patch(
  "/updateTaskStatus/:id",
  authVerify.userAuthVerification,
  service.updateTaskStatus
);
router.delete(
  "/deleteTaskItemById/:id",
  authVerify.userAuthVerification,
  service.deleteTaskItem
);

router.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} in the server`, 404));
});

router.use(globalErrorController);

module.exports = router;
