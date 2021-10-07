const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
module.exports = function () {
        const db = config.get("DB");
        mongoose.connect(db,
                { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
                .then(() => winston.info(`connected to mongodb.....${db}`))
        /*no catch block here because if connection fails, it will be handled as an uncaught exception */
}
