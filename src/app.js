var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    override = require('./middleware/override'),
    app = express(),
    port = process.env.PORT || process.env.VMC_APP_PORT || 3001,
    ip = process.env.IP || process.env.VMC_APP_IP || '0.0.0.0',
    config = require('./config');

app.configure(function () {
    app.set('port', port);

	app.use(express.compress());
	app.use(express.bodyParser({ hash: 'sha256' }));
	app.use(override.acceptOverride());
	app.use(override.methodOverride());
	app.use(express.logger('dev'));
	app.use(express.cookieParser(config.cookieParserSalt));
	app.use(express.session());
	app.use(app.router);
    
    //static
    //app.use(express.static(path.join(__dirname, '../public')));
});

app.configure('development', function () {
	express.errorHandler.title = 'minimal rest implementation';
	app.use(express.errorHandler());
});

var server = http.createServer(app);
routes.init(app);
server.on("listening", function () {
    console.log('Server listening on port ', port);
});
server.listen(port);


//export server for test framework
module.exports = server;