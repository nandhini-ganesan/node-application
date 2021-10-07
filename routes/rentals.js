const {RentalCollectionClass,validateRental} = require('../schema/rental_schema');
const {CustomerCollectionClass} = require('../schema/customer_schema');
const {MovieCollectionClass} = require('../schema/movies_schema');
const express = require('express');
const router = express.Router();
router.use(express.json());
const mongoose = require('mongoose');
const fawn = require('fawn');

fawn.init(mongoose);
  
  router.get('/', async (req, res) => {
    const get_all_docs = await RentalCollectionClass.find().sort('-dateOut');
    res.send(get_all_docs);  
  });
  
  router.post('/', async (req, res) => {
    const { error } = validateRental(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const cusid = mongoose.Types.ObjectId(req.body.customerId);
    const cusexists = await CustomerCollectionClass.findById(cusid);
    if(!cusexists) return res.status(400).send("Invalid customer id");

    const movieid = mongoose.Types.ObjectId(req.body.movieId);
    const movieexists = await MovieCollectionClass.findById(movieid);
    if(!movieexists) return res.status(400).send("Invalid movie id");

    if(movieexists.numberInStock === 0) return res.status(400).send("Movie not in stock");

    let newdoc = new RentalCollectionClass({
      customer : {
          _id : cusexists._id,
          phone : cusexists.phone,
          isGold : cusexists.isGold
      },
      movie : {
          _id : movieexists._id,
          title : movieexists.title,
          dailyRentalRate : movieexists.dailyRentalRate
      }
    });
    /*newdoc = await newdoc.save();
    movieexists.numberInStock--;
    movieexists.save();*/
    try{
        new fawn.Task()
        .save('rentalcollections',newdoc)
        .update('moviecollections',{ _id : movieexists._id},{ $inc : {numberInStock : -1}})
        .run();
        res.send(newdoc);
    } catch(err){
        res.status(500).send("Internal server error");
    }  
  });
  
  router.put('/:id', async (req, res) => {
    const { error } = validateRental(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const cusid = mongoose.Types.ObjectId(req.body.customerId);
    const cusexists = await CustomerCollectionClass.findById(cusid);
    if(!cusexists) return res.status(400).send("Invalid customer id");

    const movieid = mongoose.Types.ObjectId(req.body.movieId);
    const movieexists = await MovieCollectionClass.findById(movieid);
    if(!movieexists) return res.status(400).send("Invalid movie id");

    const doc_to_update = await MovieCollectionClass.findByIdAndUpdate (req.params.id, {
        title : req.body.title,
        genre : {
            _id : req.body.genreId,
            name : genreexists.name
          },
        numberInStock : req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate
    }, { new : true} );
    
    if (!doc_to_update) return res.status(404).send('The rental with the given ID was not found.');
    
    res.send(doc_to_update);
  });
  
  router.delete('/:id', async (req, res) => {
    const doc_to_delete = await RentalCollectionClass.findByIdAndRemove(req.params.id);
    if (!doc_to_delete) return res.status(404).send('The rental with the given ID was not found.');
    res.send(doc_to_delete);
  });
  
  router.get('/:id', async (req, res) => {
    const doc_to_get = await RentalCollectionClass.findById(req.params.id);
    if (!doc_to_get ) return res.status(404).send('The rental with the given ID was not found.');
    res.send(doc_to_get );
  });
  
   module.exports = router;