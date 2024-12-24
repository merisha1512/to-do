const joi = require('joi');

const userLogin =  (req,res,next)=>{
    const schema = joi.object({
        email : joi.string().email().required(),
        password: joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    });
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();
};

const forgotPassword =(req,res,next)=>{
    const schema = joi.object({
        email : joi.string().email().required(),
    })
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();

}

const resetPassword = (req,res,next)=>{
    const schema = joi.object({
        newPassword:joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    })
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();
}

const changePassword =(req,res,next)=>{
    const schema = joi.object({
        email : joi.string().email().required(),
        oldPassword:joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        newPassword:joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),

    })
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();
}
module.exports={userLogin,forgotPassword,
                resetPassword,changePassword}