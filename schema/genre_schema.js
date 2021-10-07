const mongoose = require('mongoose');
const Joi = require('joi');

const GenreSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    minlength : 3,
    maxlength : 10
  }
});

const CollectionClass = mongoose.model( 'GenreCollection', GenreSchema);
    

  function validateGenre(genre) {
    const schema = {
      name: Joi.string().min(3).max(10).required()
    };
   
    return Joi.validate(genre, schema);
  }

  exports.CollectionClass = CollectionClass;
  exports.validateGenre = validateGenre;
  exports.GenreSchema = GenreSchema;