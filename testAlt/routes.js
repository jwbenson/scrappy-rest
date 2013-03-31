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
});