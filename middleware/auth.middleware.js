const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next)=>{
    try {
        const authorization = req.headers.authorization;
        if(!authorization){
            res.status(401).json({Message: 'Token not found'})
        }
        //Extract the token from the req.header 
        const token = req.header("Authorization")?.replace("Bearer ", "")
        //const token = req.headers.authorization.split(" ")[1];
       // const token = req.headers.authorization.split(" ")[1];
        //const token = req.header("Authorization")?.replace("Bearer ", "")
        if(!token)
        {
            res.status(401).json({Message: 'Unauthorized Token'})
        }
         //verifying the jwt
         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

         //Attach the USER Information to the req body
         req.user = decodedToken;
         next();
    } catch (error) {
        console.log("Error:", error)
        res.status(500).json({Message: 'Internal Server ERROR !! Invalid Token' })
    }
}
module.exports = {jwtAuthMiddleware};