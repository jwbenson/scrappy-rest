//todo: add warning when configuration does not exist
var config = require('./configuration');

if(!config.connectionString){
    config.connectionString = 'mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + 
        config.mongo.hostname + ':' + config.mongo.port + '/' + config.mongo.db;
}

module.exports = config;