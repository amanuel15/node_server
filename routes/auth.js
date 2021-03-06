const router = require('express').Router();
const {registerValidation,loginValidation} = require('../routes/validation');
const { json } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


//validation


router.post('/register',async(req,res)=>{
    // const validation = Joi.validate(req.body,schema);
    const {error,value} = registerValidation(req);
    if(error)return res.status(400).send(error.details[0].message);
    //checking if the user is already in the database
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist)return res.status(400).send("Email Already Exists");
    //Hash passwords
    var hashPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        //name:req.body.name,
        email:req.body.email,
        password :hashPassword,
    });  
    var promise = new Promise(async function(resolve,reject){
        try {
            const savedUser = await user.save();
            res.send({id:savedUser._id,email:savedUser.email});
            resolve("a okay")
            
        } catch (error) {
            res.status(400).send(err);
            reject("crash and burn");
        }
    });
    return promise; 
});

router.post('/login',async(req,res)=>{
    const {error,value} = loginValidation(req);
    if(error)return res.status(400).send(error.details[0].message);
    //Check if email exists
    const user = await User.findOne({email:req.body.email});
    if(!user)return res.status(400).send("Email Doesn't Exists");
    // check if password is correct
    const passwordMatches = bcrypt.compareSync(req.body.password,user.password);
    if(!passwordMatches) return res.status(400).send("Invalid Password");
    //create and assign a token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).json({id:user._id,token:token});
});

router.put('/change_password', async (req, res) => {
    console.log('\nreq body: '+ req.body.password)
    var hashPassword = bcrypt.hashSync(req.body.password, 10);
    User.findByIdAndUpdate(
        { _id: req.header('id')},
        {
            $set: {
                password: hashPassword
            }
        },
        {new: true},
        function (err, user) {
            if (err) return res.status(404).send(err);
            return res.status(200).send(user);
        }
    );
});

router.delete('/delete_user', async (req, res) => {
    const userId = req.header('id');
    User.findByIdAndDelete(userId).then((result) => {
        User.deleteMany(
            {
                userId: userId,
            },
            function (err, success) {
                if (err) return res.status(404).send(err);
                return res.status(200).send(success);
            }
        )
        return res.status(200).send(result);
    }).catch((err)=>{
        return res.status(400).send(err);
    });
});

//import routers


module.exports = router;