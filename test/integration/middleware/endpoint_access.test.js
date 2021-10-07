let server;
const supertest = require('supertest');
const jsonwebtoken = require('jsonwebtoken');
const config = require('config');
const {CollectionClass} = require('../../../schema/genre_schema');
const {UserCollectionClass} = require('../../../schema/user_schema');

describe('Integration test - JWT authorization middleware', () => {
    let token;
    beforeEach(() => {
		server = require('../../../index.js');
        token = new UserCollectionClass().generateToken(); //will generate a valid token
	}); 
    afterEach(async () => {
		    await server.close();
        await CollectionClass.deleteMany();
	});
    const post_any_route = () => {
        return  supertest(server)
                        .post('/api/genres')
                        .set('x-jwtInHeader',token)
                        .send({name : 'newgenre'})
    };
    it('empty JWT', async () => {  
        token = ''     
		const response = await post_any_route();
		expect(response.status).toBe(401);	
    });
    it('invalid JWT', async () => {  
        token = 'a'     
		const response = await post_any_route();
		expect(response.status).toBe(400);	
    });
    it('valid JWT', async () => {     
		const response = await post_any_route();
		expect(response.status).toBe(200);	
    });
});