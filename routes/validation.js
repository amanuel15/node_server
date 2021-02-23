const Joi = require('joi');

// Register Validation

const registerValidation = (req)=>{
const schema = Joi.object({
    name:Joi.string().min(6).required(),
    email:Joi.string().min(6).required().email(),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required()
});

return schema.validate(req.body);
    

}

const loginValidation = (req)=>{
    const schema = Joi.object({
        email:Joi.string().min(6).required().email(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required()
    });
    
    return schema.validate(req.body);
        
    
    }

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;