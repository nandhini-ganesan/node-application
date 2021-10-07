/* this middleware handles all errors and logs it - that happens within express framework i.e,
request pipeline . Those errors outside the pipeline, e.g, during start of application will not
be handled by this middleware. Hence we use unhandled error/ rejected promise separetely in index.js */

const winston = require('winston');

module.exports = function(err,req,res,next){
    winston.error(err.message, {metadata : err});
    res.status(500).send("Internal server error. Try after sometime");
}