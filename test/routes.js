var request = require('supertest')
  , assert  = require("assert");
  
var host = 'http://localhost:3001';

request = request(host);

describe('Route Tests', function() {

   it('should exist', function(done) {
        request
          .get( '/')
            .expect(200, done);
    });
    
    it('should return application/json', function(done) {
        request
            .get('/test')
            .expect('Content-Type', /json/, done);
    });
    
    it('should insert a new document into test', function(done){
        request
            .post('/test')
            .send({ name: 'new item'})
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    });
});