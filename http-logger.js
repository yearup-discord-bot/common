var util = require('util');
var http = require('node:http');
var funcs = {
	log: console.log.bind(console),
	info: console.info.bind(console),
	warn: console.warn.bind(console),
	error: console.error.bind(console),
	debug: (console.debug || console.log).bind(console)
};

module.exports = patch;

function patch(fn) {
	Object.keys(funcs).forEach(function(k) {
		console[k] = function() {
			var s = typeof fn === 'function' ? fn() : fn;
			arguments[0] = util.format(s, arguments[0]);

			const options = {
				host: '127.0.0.1',
				port: '5656',
				method: 'POST',
				headers: {
					'Content-Type': 'text/plain',
					'Content-Lenght': Buffer.byteLength( arguments[0] )
				}
			}

			const request = http.request( options );

			request.on('error', (e) => {
				// console.log(e);
			});

			request.write( arguments[0] );
			request.end();


			funcs[k].apply(console, arguments);
		};
	});
}
