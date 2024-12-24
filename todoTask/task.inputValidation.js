const joi = require("joi");

const createTaskInputValidation = (req,res,next)=>{
    const schema = joi.object({
       userId:joi.string().optional(),
        task : joi.string().required(),
       description :joi.string().optional() 
         
    });
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();
};

const updateTaskInputValidation =(req,res,next)=>{
    const schema = joi.object({
       
        task : joi.string().required(),
       description :joi.string().optional() 
         
    });
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();

}

module.exports ={createTaskInputValidation,updateTaskInputValidation}