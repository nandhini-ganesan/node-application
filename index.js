//loading the handling of erros and logging it. Load this first just incase if anything fails 
//before routes/db connection will also get logged
require('./startup/logger')(); 

//loading all the routes
const express = require('express');
const app = express();
require('./startup/load_routes')(app);

//loading mongodb connection and logging the info
require('./startup/db_connection')();

//loading the configuration for environment variables
require('./startup/load_configurations')();

//loading the configuration for production in heroku
require('./startup/production')(app);

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//establishing connection to port
const winston = require('winston');
const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;