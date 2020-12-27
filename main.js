var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var server = http.createServer(function (request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/'){
        fs.readFile(`./main.html`, 'utf-8', function (err, main){
            response.writeHead(200);
            response.end(main);
        })
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
})

server.listen(3000);