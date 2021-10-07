const {CustomerCollectionClass,validateCustomer} = require('../schema/customer_schema');
const express = require('express');
const router = express.Router();
router.use(express.json());
const mongoose = require('mongoose');
  
  router.get('/', async (req, res) => {
    const get_all_docs = await CustomerCollectionClass.find().sort('name');
    res.send(get_all_docs);  
  });
  
  router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let newdoc = new CustomerCollectionClass({
      name : req.body.name,
      phone : req.body.phone,
      isGold : req.body.isGold
    });
    newdoc = await newdoc.save();
    res.send(newdoc);
  });
  
  router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const doc_to_update = await CustomerCollectionClass.findByIdAndUpdate (req.params.id, {
      name : req.body.name,
      phone : req.body.phone,
      isGold : req.body.isGold
    }, { new : true} );
    
    if (!doc_to_update) return res.status(404).send('The customer with the given ID was not found.');
    
    res.send(doc_to_update);
  });
  
  router.delete('/:id', async (req, res) => {
    const doc_to_delete = await CustomerCollectionClass.findByIdAndRemove(req.params.id);
    if (!doc_to_delete) return res.status(404).send('The customer with the given ID was not found.');
    res.send(doc_to_delete);
  });
  
  router.get('/:id', async (req, res) => {
    const doc_to_get = await CustomerCollectionClass.findById(req.params.id);
    if (!doc_to_get ) return res.status(404).send('The customer with the given ID was not found.');
    res.send(doc_to_get );
  });
  
   module.exports = router;