const jwt = require("jsonwebtoken");

const SECRET = "secretkey";

module.exports = function(req, res, next){
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({message:"No token"});
    }

    try{
        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.id;
        next();
    }catch(err){
        res.status(401).json({message:"Invalid token"});
    }
};