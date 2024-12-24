const joi = require("joi");

const createTaskItemInputValidation = (req, res, next) => {
  const schema = joi.object({
    taskItem: joi.string().required(),
    DueDate: joi.date().optional(),
    status:joi.string().optional()
   
  });
  const input = schema.validate(req.body);

  if (input.error) return res.status(400).send(input.error.details[0].message);
  next();
};

const updateTaskIdemInputValidation = (req,res,next) => {
  const schema = joi.object({
    taskItem: joi.string().required(),
    DueDate: joi.date().optional(),
  });
  const input = schema.validate(req.body);

  if (input.error) return res.status(400).send(input.error.details[0].message);
  next();
};

module.exports = {
  createTaskItemInputValidation,
  updateTaskIdemInputValidation,
};
