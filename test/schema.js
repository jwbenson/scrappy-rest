var request = require('supertest'),
    assert = require('assert'),
    schema = require('../src/schema'),
    testSchema = require('./fixtures/test.schema.json');
    
describe('schema.validate', function() {
    it('should succeed', function(done) {
        schema.validate({ name: "asdf" }, testSchema, function(err, obj, report){
            assert.equal(null, err);
            done();
        });
    });
    
    it('should fail', function(done) {
        schema.validate({ name : 123 }, testSchema, function(err, obj, report){
            assert.equal(true, Array.isArray(err));
            done();
        });
    });
    
    it('should populate default', function(done) {
        schema.validate({}, testSchema, function(err, obj, report){
            assert.equal(obj.name, "default");
            done();
        });
    });
    
    it('should be a number', function(done) {
        schema.validate({ testNumber: "123"}, testSchema, function(err, obj, report){
            assert.equal(typeof obj.testNumber, "number");
            done();
        });
    });
});