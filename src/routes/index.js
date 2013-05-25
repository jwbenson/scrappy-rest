var mongoskin = require('mongoskin');
var traverse = require('traverse');
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

//single level...
var getQueryFilter = function(str) {
    console.log(str);
    var parsed = JSON.parse("{" + str + "}");
    var query = {};
    traverse(parsed).forEach(function (val) {
        if(this.key == '$like') {
            query[this.key] = new RegExp(val, "i");
        }
        else {
            query[this.key] = val;
        }
        //console.log(x); //if (x < 0) this.update(x + 128);
    });
    return query;
};

var getQueryOptions = function (req) {
    var options = {
        limit: Math.min(req.query['$top'] || 1000000, config.mongo.pageSize),
        skip: req.query['$skip'] || 0
    };
    if(req.query['$orderby']) {
        options.orderby = odataParser.parse("$orderby=" + req.query['$orderby']);
    }
    return options
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
        var options = getQueryOptions(req);
        
        var query = {};
        getCollection(req).find(query, options).toArray(function(err, objects){
            if(err) { throw err; }
            translator.send(req, res, objects);
        });
    },
    findInKey: function (req, res) {
        
        var key = req.params.key;
        var value = req.params.value;
        
        var options = getQueryOptions(req);
        var query = {};
        
        query[key] = { $regex: value, $options: 'i' };
        //
        getCollection(req).find(query, options).toArray(function(err, items){
            if(err) { throw err; }
            console.log(items);
            translator.send(req, res, items);
        });
    },
    
    findById: function (req, res) {
        getCollection(req).findOne({_id: ObjectID.createFromHexString(req.params.id)}, function(err, item){
            if(err) { throw err; }
            translator.send(req, res, item);
        });
    },
    
    addItem: function (req, res) {
        var items = req.body;
        var options = { safe: true };
    
        getCollection(req).insert(items, options, function (err, docs) {
            if (err) { throw err; }		
            translator.send(req, res, docs);
        });
    },
    
    updateItem: function (req, res)  {
        var options = { safe: true };
        var collection = getCollection(req);
        console.log(req.body);
        collection.save(req.body, options, function (err, results) {
            if (err) { throw err; }    
            collection.findOne({_id: ObjectID.createFromHexString(req.params.id)}, function(err, item){
                if(err) { throw err; }
                translator.send(req, res, item);
            });
        });
    },
    deleteItem: function (req, res) {
        getCollection(req).remove({_id: ObjectID.createFromHexString(req.params.id)}, {safe: true}, function (err, result){
            if(err) { throw err; }
            translator.send(req, res, '')
        });
        
    }
};

exports.init = function(app){
    app.get('/', route.index);
    app.get('/schema/:name', route.schema);
    app.get('/search/:collection/:key/:value', route.findInKey);
    app.get('/:collection', route.find);
    app.get('/:collection/:id', route.findById);
    app.post('/:collection', route.addItem);
    app.delete('/:collection/:id', route.deleteItem);
    app.put('/:collection/:id', route.updateItem);
    app.post('/:collection/:id', route.updateItem);
};