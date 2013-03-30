var request = require('supertest'),
    assert = require('assert'),
    app = require('../src/app'),
    auth = require('./fixtures/auth');

describe('Route Tests', function() {

    //wait for database init & route init
	before(function(done) {
		app.on("listening", function() {
			done();
		});
	});

	//cleanup
	after(function(done){
		app.close();		
		done();
	});

	//get index
	it("GET /, should return text/html 200 OK", function(done) {
		request(app)
			.get('/')
			.expect('Content-Type', /html/)
			.expect(200, done);
	});
	
});