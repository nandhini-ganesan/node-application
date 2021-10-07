const mongoose = require('mongoose');
const Joi = require('Joi');
const {GenreSchema} = require('./genre_schema');

const MovieSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 30
    },
    genre: {
        type : GenreSchema,
        required : true
    },
    numberInStock: {
        type : Number,
        default : 10,
        min : 0,
        max : 10
    },
    dailyRentalRate: {
        type : Number,
        default : 2,
        min : 1,
        max : 5
    }
});

const MovieCollectionClass = new mongoose.model('MovieCollection',MovieSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(3).max(30).required(),
        genreId: Joi.objectId().required(),
        numberInStock : Joi.number().min(0).max(10),
        dailyRentalRate : Joi.number()
    };
    return Joi.validate(movie, schema);
  }

exports.MovieCollectionClass = MovieCollectionClass;
exports.validateMovie = validateMovie;