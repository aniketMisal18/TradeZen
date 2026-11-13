const jwt = require("jsonwebtoken");

const checkAuth = (req,res,next) =>{
    const auth =  req.cookies.token;
    if(!auth){
       return res.status(403).json({message : "Unauthorized , jwttoken is requied"});
    }
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(401).json({message : "Unauthorized , jwttoken is wrong or expire"});
    }

}

module.exports = {checkAuth};