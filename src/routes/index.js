
var schema = require('../schema');
var translator = require('../middleware/formatTranslator');

//todo, xml / html translator should be handled in a view / doesn't belong in middleware
var route = {
    index: function(req, res){
        translator.send(req, res, 'hi');
    },
    find: function(req, res) {
        translator.send(req, res, [{name:'item'}, {name:'item2'}]);
    },
    findById: function (req, res) {
        translator.send(req, res, {name: 'item'});
    },
    addItem: function (req, res) {
        translator.send(req, res, {name: 'new item'});
    },
    updateItem: function (req, res) {
        translator.sned(req, res, {name: 'update item'});
    },
    deleteItem: function (req, res) {
        translator.send(req, res, '')
    }
};

exports.init = function(app){
    app.get('/', route.index);
    app.get('/:collection', route.find);
    app.get('/:collection/:id', route.findById);
    app.post('/:collection', route.addItem);
    app.put('/:collection/:id', route.updateItem);
    app.delete('/:collection/:id', route.deleteItem);
};