const mongoose = require('mongoose');
const Joi = require('Joi');

const CustomerSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 15
    },
    isGold: {
        type : Boolean,
        default : false
    },
    phone: {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 5
    }
});

const CustomerCollectionClass = new mongoose.model('CustomerCollection',CustomerSchema);

function validateCustomer(customer) {
    const schema = {
      name: Joi.string().min(2).max(15).required(),
      phone: Joi.string().min(5).max(5).required(),
      isGold : Joi.boolean()
    };
    return Joi.validate(customer, schema);
  }

exports.CustomerCollectionClass = CustomerCollectionClass;
exports.validateCustomer = validateCustomer;
