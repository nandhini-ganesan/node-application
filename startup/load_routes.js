const genres_access = require('../routes/genres');
const customers_access = require('../routes/customers');
const movies_access = require('../routes/movies');
const rentals_access = require('../routes/rentals');
const users_access = require('../routes/users');
const returns_access = require('../routes/returns');
const auth_access = require('../routes/auth');
const error_middleware = require('../middleware/error_log');
const express = require('express');

module.exports = function (app) {
    app.use(express.json());    //require express
    app.use('/api/genres', genres_access);
    app.use('/api/customers', customers_access);
    app.use('/api/movies', movies_access);
    app.use('/api/rentals', rentals_access);
    app.use('/api/users', users_access);
    app.use('/api/auth', auth_access);
    app.use('/api/returns',returns_access);
    
//require error_middleware after all the routes, so any error from req processing pipeline will be
//handled in this middleware
    app.use(error_middleware); 
}