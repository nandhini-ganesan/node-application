const express = require('express');
const { RentalCollectionClass,validateRental } = require('../schema/rental_schema');
const { MovieCollectionClass } = require('../schema/movies_schema');
const endpoint_middleware = require('../middleware/endpoint_access');
const router = express.Router();


router.use(express.json());

router.post('/',endpoint_middleware,async (req, res) => {
    const { error } = validateRental(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const rental_exists = await RentalCollectionClass.lookup(req.body.customerId,req.body.movieId);

    if(!rental_exists) 
        return res.status(404).send('Rental with given customer/movie not in db'); 
    if(rental_exists.dateReturned)         
        return res.status(400).send('Rental with given customer/movie already processed');  
    
    rental_exists.calculateFee();
    await rental_exists.save();  
    
    await MovieCollectionClass.update({_id : rental_exists._id},{
        $inc : {numberInStock : 1}
    });
    return res.send('rental_exists');                                          
});

module.exports = router;
