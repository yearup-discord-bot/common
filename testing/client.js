console.log('Hello world!');

const http = require('node:http');

const postData = JSON.stringify({ 'msg': 'Hello World!' });

const options = {
	hostname: '127.0.0.1',
	port: '5656',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(postData)
	}
};

const req = http.request(options, (res) => {
	console.log(`STATUS: ${res.statusCode}`);
	console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	res.setEncoding('utf8');
	res.on('data', (chunk) => {
		console.log(`BODY: ${chunk}`);
	});
	res.on('end', () => {
		console.log('No more data in response.');
	});
});


req.on('error', (e) => {
	console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();