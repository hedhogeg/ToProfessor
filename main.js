var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var mysql = require('mysql');

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'opentt'
});
db.connect();



var server = http.createServer(function (request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;


    if (pathname === '/'){
        fs.readFile(`./main.html`, 'utf-8', function (err, main){
            response.writeHead(200, {'Content-Type' : 'text/html'});
            response.end(main);
        })
    }
    else if (pathname === '/main.css'){
        fs.readFile(`./main.css`, 'utf-8', function (err, main){
            response.writeHead(200, {'Content-Type' : 'text/css'});
            response.end(main)
        })
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
})



server.listen(3000);

db.end();