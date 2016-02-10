const
    PORT = 3000;

var express = require('express'),
    path = require('path'),
    http = require('http');

var app = express();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(app.router);

app.set('views', path.join(__dirname, 'views') );
app.set('view engine', 'jade');

// app.use(express.session({ secret: 'your secret here' }));


app.use('/css', express.static( path.join(__dirname, '/css') ));
app.use('/blocks', express.static( path.join(__dirname, '/blocks') ));
app.use('/js', express.static( path.join(__dirname, '/js') ));
app.use('/views', express.static( path.join(__dirname, '/client/views') ));


app.get( '/', function( req, res, next ){
	res.render('index');
});

var server = http.createServer(app);
    server.listen( PORT, function(){
    console.log('Server is strarted. at port ' + PORT );
});

require('./server_socket.js')(server);




