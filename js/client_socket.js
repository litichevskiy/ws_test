(function( exports, PubSub ) {

	function init_socket ( URL ) {

		var defer = new Ext.Deferred();

		var socket = new WebSocket( URL ),
			pubsub = new PubSub,
			storageDeferred = {};

		socket.onopen = function() {
  			defer.resolve( _socket );
		};

		socket.onerror = function ( error ) {
			defer.reject( error )
		};

		socket.onmessage = function( event ) {
			var response = format.decode( event.data );

			if ( response instanceof Error ) throw(Error);

          // post
          // если с сервера приходит ответ на пост
					// то проверяем наличие именно этого token и
					// и возвращаем promise с данными
			if( storageDeferred[response.token] ) {

				storageDeferred[response.token].defer.resolve( response.data );
				delete storageDeferred[response.token];

			}else{
				// eventName
				// если пришли данные с eventName,то
				// публикуем их ( pubsub )
				pubsub.publish( response.eventName, response.data );
			}
		};


		var getToken = (function () {
				var token = 1;

				return function (){
					return token++;
				}
		})();

		var format = {

			decode : function ( data ) {
				var message,lengthData;

				try{ message = JSON.parse( data ) }
				catch(error){ return new Error('неправильные данные');  }   //с сервера может прийти ответ в формате
																			// ( token/data ) или ( eventName/data )
				lengthData = Object.keys( message ).length;

				if ( lengthData !== 2  ) return new Error('неправильные данные');

				if ( !message.hasOwnProperty('data') ) return new Error('неправильные данные');

				if ( !message.hasOwnProperty('token') && !message.hasOwnProperty('eventName') ){
				 	return new Error('неправильные данные');
				}
				return message;
			},

			encode : function ( data ) {
				return JSON.stringify( data );
			}
		};

		var _socket = {

			post : function ( data ) {

				var defer = new Ext.Deferred(),
					token = getToken(),
					dataEncode;

				dataEncode = format.encode({
					token : token,
					data  : data
				});

  				socket.send( dataEncode );

  				storageDeferred[token] = {
  					defer : defer
  				};

  				return defer.promise;
			},

			on : pubsub.subscribe.bind( pubsub )
		};

		return defer.promise;
	};

	exports.socket = init_socket;

})( window, PubSub );