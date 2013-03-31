var request = require('supertest'),
    assert = require('assert'),
    app = require('../src/app'),
    ip = process.env.IP || process.env.VMC_APP_IP || '0.0.0.0',
    port = process.env.PORT || process.env.VM_APP_PORT || '3001';

    
describe('POST /', function(){
  it('should exist', function(done){
    request(app)
        .post('/')
        .send({
            'img_uri' : 'foobar'
        })
        .expect(200)
        .end(function(err, res){
            done();
        })
  })
});