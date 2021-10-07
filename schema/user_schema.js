const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const UserSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    minlength : 3,
    maxlength : 10
  },
  email : {
    type : String,
    required : true,
    minlength : 3,
    maxlength : 255,
    unique : true
  },
  password : {
    type : String,
    required : true,
    minlength : 3,
    maxlength : 255,
    unique : true
  },
  isAdmin : Boolean
});

UserSchema.methods.generateToken = function() {
  const jwtoken = jwt.sign({ _id : this._id, isAdmin : this.isAdmin},config.get("DigitalSignatureKey"));
  return(jwtoken);
}

const UserCollectionClass = mongoose.model( 'UserCollection', UserSchema);
  
  function validateUser(user) {
    const schema = {
      name: Joi.string().min(5).max(10).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
  }

  exports.UserCollectionClass = UserCollectionClass;
  exports.validateUser = validateUser;