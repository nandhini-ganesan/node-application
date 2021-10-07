const {UserCollectionClass} = require('../../../schema/user_schema');
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');
const config = require('config');

describe('test for generateToken', () => {
    it("should return a valid json web token", () => {
        const payloadObject = { _id : new mongoose.Types.ObjectId().toHexString(), isAdmin : true};
        const userObject = new UserCollectionClass(payloadObject);
        const token = userObject.generateToken();
        const result = jsonwebtoken.verify(token,config.get("DigitalSignatureKey"));
        expect(result).toMatchObject(payloadObject);
    });
});