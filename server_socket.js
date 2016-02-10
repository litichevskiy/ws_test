var Q = require('q');

module.exports = function( server ) {

	var WebSocketServer = new require('ws'),
		webSocketServer = new WebSocketServer.Server({
	  		server : server
		});

		var format = {

			decode : function ( data ) {
				return JSON.parse( data );
			},

			encode : function ( data ) {
				return JSON.stringify( data );
			}
		};

	function manipulationData( userData ) {
		var defer = Q.defer();

			defer.resolve({
				data      : 'server response ' + userData.data,
				token     :  userData.token,
			});

		return defer.promise;
	};


	webSocketServer.on('connection', function ( ws ) {

		console.log('connect');

	  	ws.on('message', function( message ) {
	  		var messageDecode = format.decode( message );

	  		manipulationData( messageDecode )
	  		.then(function( result ){
	  			var response = format.encode( result );

	  			ws.send( response );
	  		})
	  		.fail(function( err ){
	  			console.log( err );
	  		})

	  	});

	  	ws.on('close', function() {
	  	  	console.log('disconnect');

	  	});

	});

};