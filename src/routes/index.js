var mongoskin = require('mongoskin');
var schema = require('../schema');
var translator = require('../middleware/formatTranslator');
var config = require('../config');
var db = mongoskin.db(config.connectionString, {safe:false});
var ObjectID = db.bson_serializer.ObjectID;

var getCollection = function(req){
    var name = req.params.collection;
    if(!name){
        throw("collection not defined");
    }
    if(!schema.schemas[name]) {
        throw("schema not found for " + name);
    }
    return db.collection(name);
};

//todo, xml / html translator should be handled in a view and doesn't belong in middleware
var route = {
    index: function(req, res){
        translator.send(req, res, 'hi');
    },
    schema: function(req, res){
        translator.send(req, res, schema.schemas[req.params.name])  
    },
    find: function(req, res) {
        getCollection(req).find({}, {limit: config.mongo.pageSize}).toArray(function(err, objects){
            if(err) { throw err; }
            translator.send(req, res, objects);
        });
    },
    findById: function (req, res) {
        getCollection(req).findOne({_id: ObjectID.createFromHexString(req.params.id)}, function(err, item){
            if(err) { throw err; }
            translator.send(req, res, item);
        });
    },
    addItem: function (req, res) {
        throw("not implemented");
        getCollection(req);
        translator.send(req, res, {name: 'new item'});
    },
    updateItem: function (req, res) {
        throw("not implemented");
        getCollection(req);
        translator.sned(req, res, {name: 'update item'});
    },
    deleteItem: function (req, res) {
        throw("not implemented");
        getCollection(req);
        translator.send(req, res, '')
    }
};

exports.init = function(app){
    app.get('/', route.index);
    app.get('/schema/:name', route.schema);
    app.get('/:collection', route.find);
    app.get('/:collection/:id', route.findById);
    app.post('/:collection', route.addItem);
    app.put('/:collection/:id', route.updateItem);
    app.delete('/:collection/:id', route.deleteItem);
};