const jwt = require('jsonwebtoken');



module.exports = (req,res,next)=>{
    const token = req.header('auth-token');
    const id = req.header('id');
    if(!token)return res.status(401).send('Access Denied');
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        if(verified._id != id) return res.status(401).send('Access Denied');
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send('Invalid Token');
    }

}