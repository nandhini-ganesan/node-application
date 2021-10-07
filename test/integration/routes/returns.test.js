const {RentalCollectionClass} = require('../../../schema/rental_schema');
const {UserCollectionClass} = require('../../../schema/user_schema');
const {MovieCollectionClass} = require('../../../schema/movies_schema');
const mongoose = require('mongoose');
const supertest = require('supertest');
const moment = require('moment');

describe('Integration test - /api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let movie;
    let rental;
    let token;

	beforeEach(async () => {
		server = require('../../../index.js');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        
        movie = new MovieCollectionClass ({
            _id : movieId,
            title : 'movieTitle',
            dailyRentalRate : 2,
            genre : {
                name : 'Thriller'
            }
        });
        await movie.save();

        rental = new RentalCollectionClass({
            customer : {
                _id : customerId,
                name : 'nandhini',
                phone : 12345
            },
            movie : {
                _id : movieId,
                title : 'movieTitle',
                dailyRentalRate : 2
            }
        });
        await rental.save();
        token = new UserCollectionClass().generateToken(); //will generate a valid token
	});
	afterEach(async () => {
		await server.close();
		await RentalCollectionClass.deleteMany();
        await MovieCollectionClass.deleteMany();
	});

    const post_returns = async () => {
        return await supertest(server)
                        .post('/api/returns')
                        .set('x-jwtInHeader',token)
                        .send({customerId : customerId,
                                movieId : movieId});
    };

    it('endpoint middleware - error when no jwt token in header', async() => {
        token = '';
        const result = await post_returns();
        expect(result.status).toBe(401);
    });
    it('error when customerid not provided', async() => {
        customerId = '';
        const result = await post_returns();
        expect(result.status).toBe(400);
    });
    it('error when movieid not provided', async() => {
        movieId = '';
        const result = await post_returns();
        expect(result.status).toBe(400);
    });
    it('error when rental with given cust/movie not in db', async() => {
        await RentalCollectionClass.deleteMany({});
        const result = await post_returns();
        expect(result.status).toBe(404);
    });
    it('error when rental with given cust/movie already processed', async() => {
        rental.dateReturned = new Date();
        await rental.save();
        const result = await post_returns();
        expect(result.status).toBe(400);
    });
    it('for a valid rental, date returned is set', async() => {
        const result = await post_returns();
        const rentalinDB = await RentalCollectionClass.findById(rental._id)
        expect(rentalinDB.dateReturned).toBeDefined(); 
    });
    it('for a valid rental, return fee is set', async() => {
        rental.dateOut = moment().add(-7,'days').toDate();
        await rental.save();
        const result = await post_returns();
        const rentalinDB = await RentalCollectionClass.findById(rental._id)
        expect(rentalinDB.rentalFee).toBeDefined();
    });
    it('for a valid rental, increase movie stock count', async() => {
        const result = await post_returns();
        const movieinDB = await MovieCollectionClass.findById(movieId)
        expect(movieinDB.numberInStock).toBeDefined();
    });
    it('valid return request should return 200', async() => {
        const result = await post_returns();
        expect(result.status).toBe(200);
    });
}); 
    