const http = require('http');
const request = require('request');
const nodeURL = require('url');

const port = process.env.PORT || 8080;

http
	.createServer((req, res) => {
		const { url, json } = nodeURL.parse(req.url, true).query;

		if (!url) {
			res.setHeader('Content-Type', 'text/html');
			return res.end(
				`Your request should be in this format: <code style="background-color:#f3dfa5;padding:5px">${req.headers.host}?url={#URL}</code>`
			);
		}

		res.setTimeout(10000);
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', '*');

		request(url, { encoding: 'utf-8' }, (error, response, body) => {
			if (error) {
				res.end("Request couldn't be processed");
			}

			if (!!json) {
				res.end(body);
			} else {
				const cheerio = require('cheerio');
				const $ = cheerio.load(body);
				$('head').append(`<base href=${url}>`);
				res.end($.html());
			}
		});
	})
	.listen(port);

console.log('Listening on port: ' + port);
