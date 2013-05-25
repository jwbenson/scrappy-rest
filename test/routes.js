var request = require('supertest')
  , assert  = require("assert");
  
var host = 'http://bapi.jbenson.c9.io';

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
    
    it('should insert and update and delete new document', function(done){
        request
            .post('/test')
            .send({ name: 'new item'})
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                if (err) return done(err);
                var item = res.body[0];
                console.log(item);
                request
                    .put('/test/'+item._id)
                    .send({ name: 'changed item', _id: item._id })
                    .end(function(err, res){
                        if (err) done(err);
                        request
                            .get('/test/'+item._id)
                            .set('X-HTTP-METHOD', 'delete')
                            .end(function(err, res){
                                if (err) done(err);
                                done();
                            });
                    });
                
            });
    });
    
    
});