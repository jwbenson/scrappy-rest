var request = require('supertest'),
    assert = require('assert');

describe('GET /', function() {
    it('should exist', function(done) {
        request(app)
            .get(host + '/')
            .expect(200, done);
    });
    
    it('should return application/json', function(done) {
        request(app)
            .get(host + '/test')
            .expect('Content-Type', /json/, done);
    });
    
    it('should insert a new document into test', function(done){
        request(app)
            .post(host + '/test')
            .send({ name: 'new item'})
            .expect(200)
            .expect('Content-Type')
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    });
});