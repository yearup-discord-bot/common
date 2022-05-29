const http = require('node:http');

const hostname = '127.0.0.1';
const port = '5656';

const server = http.createServer((req, res) => {
	let body = '';
	req.on('data', chunk => {
		body += chunk.toString(); // convert Buffer to string
	});
	req.on('end', () => {
		console.log(body);
		res.end('ok');
	});

	res.writeHead(200, {
		'Content-Type': 'text/plain',
		'Content-Length': Buffer.byteLength(body)
	});
	res.end(body);
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}`);
});
