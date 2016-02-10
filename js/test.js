(function(){

	const
		URL = 'ws://localhost:3000';

	var obj = {
		func : function( data ){
			console.log( 'FUNC: ', data )
		}
	};

	socket(URL)
	.then(function( _socket ) {

		_socket.on( 'eventName', obj.func );

		_socket.post('one')
		.then(function( response ){

			console.log( 'ONE: ',response );
		},function(error){

			console.log( error )
		});


		_socket.post('two')
		.then(function( response ){

			console.log( 'TWO: ', response );
		},function(error){

			console.log( error )
		});


	},function(error){

		console.log( error )
	})


})();