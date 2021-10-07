const middleware_function = require('../../../middleware/endpoint_access');
const {UserCollectionClass} = require('../../../schema/user_schema');
const mongoose = require('mongoose');

describe('Unit test - JWT authorization middleware', () => {
    it('valid JWT - set payload from token to request.user', () => {
        const newuser = { _id : new mongoose.Types.ObjectId().toHexString(), isAdmin : true};
        const token = new UserCollectionClass(newuser).generateToken();
        
        const req = {header : jest.fn().mockReturnValue(token) };
        const res = {};
        const next = jest.fn();
        
        middleware_function(req,res,next);

        expect(req.user).toMatchObject(newuser);
    });
});