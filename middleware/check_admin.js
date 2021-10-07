function check_admin_middleware(req,res,next){
    if(!req.user.isAdmin) return res.status(403).send('Aunthenticated user but forbidden access');
    next();
}
module.exports = check_admin_middleware;