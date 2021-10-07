const winston = require('winston');
require('winston-mongodb');

/*once we require this, thereafter in whenever we load 'express' and work with route handlers using
async function, this will monkey patch the route handler within try/catch blocks. Any error will be handled
by the error middleware function in req processing pipeline*/
require('express-async-errors');

module.exports = function () {
    //for handling rejections apart from routes
    process.on('unhandledRejection', (exp) => {
        //new winston.transports.Console({colorize : true, prettyPrint : true}); //to log it in console
        winston.error(exp.message, exp);
    });

    //for handling exceptions apart from routes
    process.on('uncaughtException', (exp) => {
        winston.error(exp.message, exp);
    });

    //log file to which all exceptions and rejections will be logged
    winston.add(new winston.transports.File({ filename: 'vidly_logger.log' }));

    /* //incase of logging to db, follow below code
    winston.add(new winston.transports.MongoDB({
     db : 'mongodb://127.0.0.1:27017/genres-project'}));*/
}
