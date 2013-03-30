var url = require('url');
var JSON_MIME = 'application/json';

// todo: implement accept override using $format query
exports.acceptOverride = function (key) {
  return function (req, res, next) {
    next();
  };
}

//handle custom http verb using  x-http-method
exports.methodOverride = function (key) {
  return function methodOverride(req, res, next) {
    if (req.headers['x-http-method-override']) {
      req.method = req.headers['x-http-method-override'].toUpperCase();
    } 
    else if (req.headers['x-http-method']) {
        req.method = req.headers['x-http-method'].toUpperCase();
    }
    
    next();
  };
};