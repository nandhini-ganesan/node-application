const {CollectionClass, validateGenre} = require('../schema/genre_schema');
const express = require('express');
const router = express.Router();
router.use(express.json());
const mongoose = require('mongoose');
const endpoint_middleware = require('../middleware/endpoint_access');
const admin_middleware = require('../middleware/check_admin');
const validateObjectId = require('../middleware/validateObjectId');

  router.get('/', async (req, res) => {
    const get_all_docs = await CollectionClass.find().sort('name');
    res.send(get_all_docs);  
  });
  
  router.post('/',endpoint_middleware, async (req, res) => {
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let newdoc = new CollectionClass({
      name : req.body.name
    });
    newdoc = await newdoc.save();
    res.send(newdoc);
  });
  
  router.put('/:id', [endpoint_middleware,validateObjectId],async (req, res) => {
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const doc_to_update = await CollectionClass.findByIdAndUpdate (req.params.id, {
      name : req.body.name
    }, { new : true} );
    
    if (!doc_to_update) return res.status(404).send('The genre with the given ID was not found.');
    
    res.send(doc_to_update);
  });
  
  router.delete('/:id',[endpoint_middleware,validateObjectId,admin_middleware], async (req, res) => {
    const doc_to_delete = await CollectionClass.findByIdAndRemove(req.params.id);
    if (!doc_to_delete) return res.status(404).send('The genre with the given ID was not found.');
    res.send(doc_to_delete);

  });
  
  router.get('/:id', validateObjectId, async (req, res) => {
    const doc_to_get = await CollectionClass.findById(req.params.id);
    if (!doc_to_get ) return res.status(404).send('The genre with the given ID was not found.');
    res.send(doc_to_get );
  });
   
   module.exports = router;