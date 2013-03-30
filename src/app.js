var express = require('express'),
    routes = require('./routes'),
    override = require('./middleware/override'),
    app = express(),
    port = process.env.PORT || process.env.VMC_APP_PORT || 3001,
    ip = process.env.IP || process.env.VMC_APP_IP || '0.0.0.0';

app.configure(function () {
    app.set('port', port);

	app.use(express.compress());
	app.use(express.bodyParser({ hash: 'sha256' }));
	app.use(override.acceptOverride());
	app.use(override.methodOverride());
	app.use(express.logger('dev'));
	app.use(express.cookieParser('Your secret key here'));
	app.use(express.session());
	app.use(app.router);
    
    //static
    //app.use(express.static(path.join(__dirname, '../public')));
});

app.configure('development', function () {
	express.errorHandler.title = 'minimal rest implementation';
	app.use(express.errorHandler());
});

routes.init(app);
app.listen(port);
console.log('Server listening on port ', port);

//export server for test framework
module.exports = app;