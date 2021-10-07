let server;
const supertest = require('supertest');
const mongoose = require('mongoose');
const {CollectionClass} = require('../../../schema/genre_schema');
const {UserCollectionClass} = require('../../../schema/user_schema');

describe('Integration test - /api/genres', () => {
	beforeEach(() => {
		server = require('../../../index.js');
	});
	afterEach(async () => {
		await server.close();
		await CollectionClass.deleteMany();
	});
//************************** GET ALL **************************************/
	describe('Get all genres', () => {	
		it('return all genres', async() => {
			await CollectionClass.collection.insertMany([
				{name : 'genre1'},
				{name : 'genre2'}
			]);
			const response = await supertest(server).get('/api/genres');
			expect(response.body.some(g => g.name === 'genre1')).toBeTruthy();
			expect(response.body.some(g => g.name === 'genre2')).toBeTruthy();
		});
	});
//************************** GET /id **************************************/
	describe('Get genre with given id', () => {
		it('return error for trying to get invalid id', async () => {
			const response = await supertest(server).get('/api/genres/1');
			expect(response.status).toBe(404); 
		});
		it('return error for trying to get valid id which is not in database', async () => {
			const validid = mongoose.Types.ObjectId();
			const response = await supertest(server).get('/api/genres/'+validid);
			expect(response.status).toBe(404); 
		});
		it('return genre with valid id', async () => {
			const curr_genre = new CollectionClass({name: 'genre1'});
			await curr_genre.save();
			const response = await supertest(server).get('/api/genres/'+curr_genre._id);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('name','genre1'); 
		});
	});
//************************** POST **************************************/
	describe('Post genre', () => {
		let token;
		let name;
		beforeEach(() => {
			token = new UserCollectionClass().generateToken(); //will generate a valid token
			name = 'genre1';
		});
		const post_genre = async () => {
			return await supertest(server)
								.post('/api/genres')
								.set('x-jwtInHeader',token) 
								.send({name : name});
		};
		it('endpoint middleware - error when no jwt token in header', async() => {
			token = '';
			const response = await post_genre();
			expect(response.status).toBe(401);
		});
		it('return error for posting invalid genre - name < 3', async() => {
			name = '1';			
			const response = await post_genre();
			expect(response.status).toBe(400);
		});
		it('return error for posting invalid genre - name > 10', async() => {
			name = new Array(12).join('a'); //build a random string of length 12
			const response = await post_genre();
			expect(response.status).toBe(400);
		});
		it('posting valid genre - saved in db', async () => {
			await post_genre();
			const g_exist = await CollectionClass.find({name : 'genre1'});								
			expect(g_exist).not.toBeNull();
		});
		it('posting valid genre - returned in response body', async () => {
			const response = await post_genre();						
			expect(response.body).toHaveProperty('name','genre1');
			expect(response.body).toHaveProperty('_id');
		});
	});
//************************** PUT **************************************/
	describe('Put genre' , () => {
		let token;
		let genre_update;
		let id;
		let newname;
		beforeEach( async () => {
			const curr_genre = new CollectionClass({name: 'genre1'});
			await curr_genre.save();
			id = curr_genre._id;
			newname = 'newgenre1';
			token = new UserCollectionClass().generateToken();
		});
		const put_genre = async () => {
			return await supertest(server)
								.put('/api/genres/'+id)
								.set('x-jwtInHeader',token) 
								.send({name : newname});
		};
		
		it('endpoint middleware - error when no jwt token in header', async () => {
			token = '';
			const response = await put_genre();
			expect(response.status).toBe(401);
		});	
		it('return error for trying to update invalid id', async () => {
			id = 1;
			const response = await put_genre();
			expect(response.status).toBe(404);
		});
		it('return error for trying to update valid id not in db', async () => {
			id = mongoose.Types.ObjectId();
			const response = await put_genre();
			expect(response.status).toBe(404);
		});
		it('return error for updating invalid name - name < 3', async() => {
			newname = '1';			
			const response = await put_genre();
			expect(response.status).toBe(400);
		});
		it('return error for updating invalid name - name > 10', async() => {
			newname = new Array(12).join('a'); //build a random string of length 12
			const response = await put_genre();
			expect(response.status).toBe(400);
		});
		it('return updated name for valid id in db', async () => {
			const response = await put_genre();
			expect(response.body).toHaveProperty('_id'); 
      		expect(response.body).toHaveProperty('name', newname);
		});		
	});
//************************** DELETE **************************************/
	describe('Delete genre', () => {
		let token;
		let curr_genre;
		let id;
		beforeEach(async () => {
			curr_genre = new CollectionClass({name: 'genre1'});
			await curr_genre.save(); 
			id = curr_genre._id;
			token = new UserCollectionClass({isAdmin : true}).generateToken();
		});
		const delete_genre = async () => {
			return await supertest(server)
								.delete('/api/genres/'+id)
								.set('x-jwtInHeader',token) 
								.send();
		};
		it('return error for deleting invalid id', async () => {
			id = 1;
			const response = await delete_genre();
			expect(response.status).toBe(404);
		});
		it('endpoint middleware - error when no jwt token in header', async () => {
			token = '';
			const response = await delete_genre();
			expect(response.status).toBe(401);
		});	
		it('admin middleware - error when user is not admin', async () => {
			token = new UserCollectionClass({isAdmin : false}).generateToken();
			const response = await delete_genre();
			expect(response.status).toBe(403);
		});
		it('return error for trying to update valid id not in db', async () => {
			id = mongoose.Types.ObjectId();
			const response = await delete_genre();
			expect(response.status).toBe(404);
		});
		it('return deleted document for valid id in db', async () => {
			const response = await delete_genre();
			expect(response.body).toHaveProperty('_id', curr_genre._id.toHexString());
      		expect(response.body).toHaveProperty('name', curr_genre.name);
		});	
	});
}); 