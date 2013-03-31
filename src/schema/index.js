//work in progress

var JSV = require('JSV').JSV;
var env = JSV.createEnvironment();
var schemas = {
    links: require('./links'),
    test: require('./test')
};

var _schema = {
    validator: env,
    getDefaultValue: function (propertyName, schema) {
        var properties = (schema || {}).properties || {};
        var d = (properties[propertyName] || {})['default']; 
        return typeof d !== 'undefined' ? d : undefined;
    },
    getTypeValue: function (propertyName, schema) {
        var properties = (schema || {}).properties || {};
        var d = (properties[propertyName] || {})['type']; 
        return typeof d !== 'undefined' ? d : undefined;
    },
    schemas: schemas
};

_schema.validate = function (obj, schema, callback) {
    for (var prop in schema.properties) {
        var defaultValue = _schema.getDefaultValue(prop, schema);
        var typeValue = _schema.getTypeValue(prop, schema);
        if(!obj.hasOwnProperty(prop) && typeof defaultValue != 'undefined') {
    		obj[prop] = defaultValue;
		}
        
        //convert strings to integers
        if(typeValue == "integer" && typeof obj[prop] == 'string') {
            if(!isNaN(parseInt(obj[prop], 10)) && isFinite(obj[prop])) {
                obj[prop] = parseInt(obj[prop], 10);
                console.log(prop)
            }
        }
	}
    var report = env.validate(obj, schema);
    var err = report.errors && report.errors.length > 0 ? report.errors : null;
    callback(err, obj, report);
};

module.exports = _schema;