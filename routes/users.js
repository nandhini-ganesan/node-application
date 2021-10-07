const {UserCollectionClass, validateUser} = require('../schema/user_schema');
const express = require('express');
const router = express.Router();
router.use(express.json());
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const endpoint_middleware = require('../middleware/endpoint_access');
  
  router.get('/me', endpoint_middleware, async(req,res) => {
    const current_user = await UserCollectionClass.findById(req.user._id).select('-password');
    res.send(current_user);
  });

  router.post('/', async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let userexists = await UserCollectionClass.findOne({email : req.body.email});
    if(userexists) return res.status(400).send("User already registered");
    
    userexists = new UserCollectionClass(_.pick(req.body,['name','email','password']));
    const saltvalue = await bcrypt.genSalt(10);
    console.log(saltvalue);
    userexists.password = await bcrypt.hash(userexists.password,saltvalue);
    await userexists.save();
    /*res.send({
        name : userexists.name,
        email : userexists.email
    });*/
    const jwtoken = userexists.generateToken();
    res.header('x-jwtInHeader',jwtoken).send(_.pick(userexists,['name','email','_id']));
  });

  module.exports = router;