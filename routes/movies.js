const {MovieCollectionClass,validateMovie} = require('../schema/movies_schema');
const {CollectionClass} = require('../schema/genre_schema');
const express = require('express');
const router = express.Router();
router.use(express.json());
const mongoose = require('mongoose');
  
  router.get('/', async (req, res) => {
    const get_all_docs = await MovieCollectionClass.find().sort('title');
    res.send(get_all_docs);  
  });
  
  router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const id = mongoose.Types.ObjectId(req.body.genreId);
    const genreexists = await CollectionClass.findById(id);
    if(!genreexists) return res.status(400).send("Invalid genre id");

    let newdoc = new MovieCollectionClass({
      title : req.body.title,
      genre : {
        _id : genreexists._id,
        name : genreexists.name
      },
      numberInStock : req.body.numberInStock,
      dailyRentalRate : req.body.dailyRentalRate
    });
    newdoc = await newdoc.save();
    res.send(newdoc);
  });
  
  router.put('/:id', async (req, res) => {
    const { error } = validateMovie(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const genreexists = await CollectionClass.findById(req.body.genreId);
    if(!genreexists) return res.status(400).send("Invalid ganre id");

    const doc_to_update = await MovieCollectionClass.findByIdAndUpdate (req.params.id, {
        title : req.body.title,
        genre : {
            _id : req.body.genreId,
            name : genreexists.name
          },
        numberInStock : req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate
    }, { new : true} );
    
    if (!doc_to_update) return res.status(404).send('The movie with the given ID was not found.');
    
    res.send(doc_to_update);
  });
  
  router.delete('/:id', async (req, res) => {
    const doc_to_delete = await MovieCollectionClass.findByIdAndRemove(req.params.id);
    if (!doc_to_delete) return res.status(404).send('The movie with the given ID was not found.');
    res.send(doc_to_delete);
  });
  
  router.get('/:id', async (req, res) => {
    const doc_to_get = await MovieCollectionClass.findById(req.params.id);
    if (!doc_to_get ) return res.status(404).send('The movie with the given ID was not found.');
    res.send(doc_to_get );
  });
  
   module.exports = router;