//endpoint/routes can be accesed by only authenticated users.
//checking if the user is an authenticated user. So if failed status is 401
const jwt = require('jsonwebtoken');
const config = require('config');
function middleware_function(req,res,next){
     const token = req.header('x-jwtInHeader');
    if(!token) return res.status(401).send("No jwt token. Authentication failed");
    try{
        const decodedpayload = jwt.verify(token,config.get("DigitalSignatureKey"));
        req.user = decodedpayload;
        next();
    }catch(exp){
        res.status(400).send('Invalid token. Authentication failed. Check client logic');
    }
}
module.exports = middleware_function;