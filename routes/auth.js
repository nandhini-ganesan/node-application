const {UserCollectionClass} = require('../schema/user_schema');
const express = require('express');
const Joi = require('joi');
const router = express.Router();
router.use(express.json());
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
  
  router.post('/', async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let userexists = await UserCollectionClass.findOne({email : req.body.email});
    if(!userexists) return res.status(400).send("Invalid email/password");
    
    const validpwd = await bcrypt.compare(req.body.password,userexists.password);
    if(!validpwd) return res.status(400).send("Invalid email/password");
    
    //const jwtoken = jwt.sign({ name : userexists.name},config.get("DigitalSignatureKey"));
    //instead of generating token in auth.js and user.js, we can define a function to generate
    //token in user_schema ----> because we need token for user object only
    const jwtoken = userexists.generateToken(); 
    res.send(jwtoken);
  });

  module.exports = router;

function validateUser(user) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
  }