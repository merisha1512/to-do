const joi = require("joi");
const mongoose = require("mongoose");
const AppError = require("../error/Apperror");

const userIdInputValidation = (req,res,next) =>{
    const chkValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    console.log(req.params.id)
    if (!chkValidId) return next( new AppError("This id is Not Found or Invalid Id",404));
    next();
};

const createUserInputValidation = (req,res,next)=>{
    const schema = joi.object({
       
        name : joi.string().required(),
        gender : joi.string().valid("Male", "Female", "Other").required(),
        email : joi.string().email().required(),
        password: joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        phone : joi.string().min(10).max(10).required(),
        isDelete: joi.boolean().optional()
        
    });
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();

};

const updateUserInputValidation =(req,res,next)=>{
    const schema = joi.object({
       
        name : joi.string().optional(),
        gender : joi.string().valid("Male", "Female", "Other").optional(),
        phone : joi.string().min(10).max(10).optional(),
       
        
    });
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();

}
module.exports={createUserInputValidation,userIdInputValidation,updateUserInputValidation}