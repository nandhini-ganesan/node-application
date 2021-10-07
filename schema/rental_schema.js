const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

const RentalSchema = new mongoose.Schema({
  customer : {
    type : mongoose.Schema({
      name : {
        type :  String,
        required : true,
        minlength : 2,
        maxlength : 15
      },
      isGold : {
        type : Boolean,
        default : false
      },
      phone: {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 5
    }}),
    required : true  
  },
  movie : {
    type : new mongoose.Schema({
      title: {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 30
      },
    dailyRentalRate: {
      type : Number,
      default : 2,
      min : 1,
      max : 5
    }}),
    required : true
  },
  dateOut : {
    type : Date,
    default : Date.now,
    required : true
  },
  dateReturned : {
    type : Date,
  },
  rentalFee : {
    type : Number,
    min : 0
  }
});

RentalSchema.statics.lookup = function(customerId,movieId) { //static method
  return this.findOne({
    "customer._id" :customerId,
    "movie._id" : movieId 
  });
}
RentalSchema.methods.calculateFee = function(){
  this.dateReturned = new Date();
  this.rentalFee = moment().diff(this.dateOut,'days')*this.movie.dailyRentalRate; 
}

const RentalCollectionClass = mongoose.model( 'RentalCollection', RentalSchema);
    
  function validateRental(rental) {
    const schema = {
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required()
    };
  
    return Joi.validate(rental, schema);
  }

  exports.RentalCollectionClass = RentalCollectionClass;
  exports.validateRental = validateRental;