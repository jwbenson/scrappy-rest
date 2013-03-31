var request = require('supertest'),
    assert = require('assert'),
    app = null;
    ip = process.env.IP || process.env.VMC_APP_IP || '0.0.0.0',
    port = process.env.PORT || process.env.VM_APP_PORT || '3001',
    host = 'http://' + ip + ':' + port;
    host = 'http://bapi.jbenson.c9.io';

describe('GET /', function() {

    //wait until server is ready
    before(function(done) {
        app = require('../src/app');
        app.on("listening", function() {
            done();
        });
    });

    //cleanup
    after(function(done) {
        app.close();
        done();
    });

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