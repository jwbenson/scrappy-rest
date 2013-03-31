var Mocha = require('mocha'),
    request = require('supertest'),
    assert = require('assert'),
    app = require('../src/app'),
    ip = process.env.IP || process.env.VMC_APP_IP || '0.0.0.0',
    port = process.env.PORT || process.env.VM_APP_PORT || '3001',
    host = 'http://' + ip + ':' + port;
    
    host = 'http://bapi.jbenson.c9.io';
    
var mocha = new Mocha();
GLOBAL.app = app;
GLOBAL.request = request;
GLOBAL.host = host;
var passed = [];
var failed = [];

mocha.addFile('./testAlt/routes.js');

app.on("listening", function(done) {
    mocha.run(function(){
    
        console.log(passed.length + ' Tests Passed');
        passed.forEach(function(testName){
            console.log('Passed:', testName);
        });
    
        console.log("\n"+failed.length + ' Tests Failed');
        failed.forEach(function(testName){
            console.log('Failed:', testName);
        });
        
        app.close();
    
    }).on('fail', function(test){
        failed.push(test.title);
    }).on('pass', function(test){
        passed.push(test.title);
    });
})
